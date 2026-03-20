package com.coachkit.auth.controller;

import com.coachkit.auth.dto.LoginResult;
import com.coachkit.auth.dto.request.*;
import com.coachkit.auth.dto.response.AuthResponse;
import com.coachkit.auth.dto.response.MessageResponse;
import com.coachkit.auth.exception.AuthException;
import com.coachkit.auth.service.*;
import com.coachkit.auth.util.CookieUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Registration, login, logout, token refresh")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final CookieUtil cookieUtil;

    @Value("${coachkit.auth.cookie.refresh-name:refresh_token}")
    private String refreshCookieName;

    @Value("${coachkit.auth.cookie.http-only:true}")
    private boolean cookieHttpOnly;

    @Value("${coachkit.auth.cookie.secure:false}")
    private boolean cookieSecure;

    @Value("${coachkit.auth.cookie.path:/api/v1/auth}")
    private String cookiePath;

    @Value("${coachkit.auth.cookie.max-age-days:7}")
    private int cookieMaxAgeDays;

    // ==================== PUBLIC ENDPOINTS ====================

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Creates account, sends verification email")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User created"),
            @ApiResponse(responseCode = "409", description = "Email already registered")
    })
    public ResponseEntity<MessageResponse> register(
            @Valid @RequestBody RegisterRequest request,
            @RequestHeader(value = "X-Device-Name", required = false)
            @Parameter(description = "Device name for session tracking") String deviceName,
            HttpServletRequest httpRequest) {

        String ip = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        MessageResponse response = authService.register(request, deviceName, ip, userAgent);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticates user and sets refresh token cookie")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
            @ApiResponse(responseCode = "403", description = "Email not verified or account deactivated")
    })
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            @RequestHeader(value = "X-Device-Name", required = false) String deviceName,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        String ip = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        LoginResult result = authService.login(request, deviceName, ip, userAgent);

        setRefreshCookie(httpResponse, result.refreshToken());

        return ResponseEntity.ok(result.userInfo());
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user info", description = "Returns current authenticated user profile")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User profile"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<AuthResponse> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {

        String accessToken = extractBearerToken(authHeader);
        UUID userId = jwtService.validateAccessToken(accessToken);

        return ResponseEntity.ok(authService.getCurrentUser(userId));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Rotates refresh token and returns new access token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    })
    public ResponseEntity<AuthResponse> refresh(
            @RequestHeader(value = "X-Device-Name", required = false) String deviceName,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        Optional<String> refreshTokenOpt = cookieUtil.extractRefreshToken(httpRequest);

        if (refreshTokenOpt.isEmpty()) {
            throw new AuthException("Refresh token required", HttpStatus.UNAUTHORIZED);
        }

        String refreshToken = refreshTokenOpt.get();
        String ip = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        LoginResult result = authService.refresh(refreshToken, deviceName, ip, userAgent);

        cookieUtil.setRefreshCookie(httpResponse, result.refreshToken());

        return ResponseEntity.ok(result.userInfo());
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Terminates current session")
    @ApiResponse(responseCode = "204", description = "Logged out")
    public ResponseEntity<Void> logout(
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        cookieUtil.extractRefreshToken(httpRequest)
                .ifPresent(authService::logout);

        cookieUtil.clearRefreshCookie(httpResponse);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify email with code",
            description = "Public endpoint for email verification links")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Email verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid parameters"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<AuthResponse> verifyEmail(
            @Valid VerifyEmailGetRequest request,
            @RequestHeader(value = "X-Device-Name", required = false) String deviceName,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        String ip = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        LoginResult result = authService.verifyEmail(
                request.getEmail(),
                request.getCode(),
                deviceName,
                ip,
                userAgent
        );

        setRefreshCookie(httpResponse, result.refreshToken());

        return ResponseEntity.ok(result.userInfo());
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend verification email", description = "Requires authentication")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Verification email sent"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "429", description = "Too many requests")
    })
    public ResponseEntity<MessageResponse> resendVerification(
            @RequestHeader("Authorization") String authHeader,
            @RequestHeader(value = "X-Device-Name", required = false) String deviceName) {

        String accessToken = extractBearerToken(authHeader);
        UUID userId = jwtService.validateAccessToken(accessToken);

        return ResponseEntity.ok(authService.resendVerification(userId, deviceName));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset", description = "Public endpoint with rate limiting")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "If email exists, reset code sent"),
            @ApiResponse(responseCode = "429", description = "Rate limit exceeded"),
            @ApiResponse(responseCode = "400", description = "Invalid email format")
    })
    public ResponseEntity<MessageResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(authService.forgotPassword(request.getEmail(), httpRequest.getRemoteAddr()));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password with code", description = "Public endpoint")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password reset successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid code or email"),
            @ApiResponse(responseCode = "429", description = "Too many attempts")
    })
    @Transactional
    public ResponseEntity<MessageResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(authService.resetPassword(
                request.getEmail(),
                request.getCode(),
                request.getNewPassword()));
    }

    // ==================== AUTHENTICATED ENDPOINTS ====================

    @PostMapping("/logout-all")
    @Operation(summary = "Logout from all devices", description = "Terminates all user sessions")
    @ApiResponse(responseCode = "204", description = "All sessions terminated")
    public ResponseEntity<Void> logoutAll(
            @RequestHeader("Authorization") String authHeader,
            HttpServletResponse httpResponse) {

        String accessToken = extractBearerToken(authHeader);
        authService.logoutAll(accessToken);
        clearRefreshCookie(httpResponse);

        return ResponseEntity.noContent().build();
    }

    // ==================== HELPER METHODS ====================

    private void setRefreshCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(refreshCookieName, token);
        cookie.setHttpOnly(cookieHttpOnly);
        cookie.setSecure(cookieSecure);
        cookie.setPath(cookiePath);
        cookie.setMaxAge(cookieMaxAgeDays * 24 * 60 * 60);
        response.addCookie(cookie);
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(refreshCookieName, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);
        cookie.setPath(cookiePath);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private String extractBearerToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AuthException("Authorization header required", HttpStatus.UNAUTHORIZED);
        }
        return authHeader.substring(7);
    }
}