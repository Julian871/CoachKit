package com.coachkit.auth.controller;

import com.coachkit.auth.dto.LoginResult;
import com.coachkit.auth.dto.request.*;
import com.coachkit.auth.dto.response.AuthResponse;
import com.coachkit.auth.dto.response.MessageResponse;
import com.coachkit.auth.entity.User;
import com.coachkit.auth.exception.AuthException;
import com.coachkit.auth.repository.UserRepository;
import com.coachkit.auth.service.*;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Registration, login, logout, token refresh")
public class AuthController {

    private final AuthService authService;
    private final RateLimitService rateLimitService;
    private final JwtService jwtService;
    private final VerificationService verificationService;
    private final UserRepository userRepository;
    private final SessionService sessionService;
    private final PasswordEncoder passwordEncoder;

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

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Rotates refresh token and returns new access token")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    })
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            @RequestHeader(value = "X-Device-Name", required = false) String deviceName,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        if (refreshToken == null) {
            throw new AuthException("Refresh token required", HttpStatus.UNAUTHORIZED);
        }

        String ip = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");

        LoginResult result = authService.refresh(refreshToken, deviceName, ip, userAgent);

        setRefreshCookie(httpResponse, result.refreshToken());

        return ResponseEntity.ok(result.userInfo());
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Terminates current session")
    @ApiResponse(responseCode = "204", description = "Logged out")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            HttpServletResponse httpResponse) {

        if (refreshToken != null) {
            authService.logout(refreshToken);
            clearRefreshCookie(httpResponse);
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/verify-email")
    @Operation(summary = "Verify email with code", description = "Requires authentication")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Email verified successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired code"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<MessageResponse> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request,
            @RequestHeader("Authorization") String authHeader) {

        String accessToken = extractBearerToken(authHeader);
        UUID userId = jwtService.validateAccessToken(accessToken);

        boolean verified = verificationService.verifyEmail(userId, request.getCode());

        if (!verified) {
            throw new AuthException("Invalid or expired verification code", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok(new MessageResponse("Email verified successfully"));
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

        // Rate limit: 1 request per minute per user
        String rateLimitKey = "resend_verification:" + userId;
        if (!rateLimitService.tryAcquire(rateLimitKey, 1, Duration.ofMinutes(1))) {
            throw new AuthException("Please wait before requesting another code", HttpStatus.TOO_MANY_REQUESTS);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found", HttpStatus.UNAUTHORIZED));

        if (user.isEmailVerified()) {
            return ResponseEntity.ok(new MessageResponse("Email already verified"));
        }

        verificationService.createEmailVerification(user);

        return ResponseEntity.ok(new MessageResponse("Verification email sent"));
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

        String email = request.getEmail().toLowerCase().trim();
        String ip = httpRequest.getRemoteAddr();

        // Rate limiting: 3 per email per hour, 10 per IP per hour
        String emailKey = "forgot_password:email:" + email;
        String ipKey = "forgot_password:ip:" + ip;

        if (!rateLimitService.tryAcquire(emailKey, 3, Duration.ofHours(1))) {
            throw new AuthException("Too many requests for this email", HttpStatus.TOO_MANY_REQUESTS);
        }

        if (!rateLimitService.tryAcquire(ipKey, 10, Duration.ofHours(1))) {
            throw new AuthException("Too many requests from this IP", HttpStatus.TOO_MANY_REQUESTS);
        }

        // Always return success to prevent email enumeration
        userRepository.findByEmail(email).ifPresent(user -> {
            verificationService.createPasswordReset(user);
            log.info("Password reset requested for: {}", email);
        });

        // Same message whether email exists or not
        return ResponseEntity.ok(new MessageResponse("If this email is registered, you will receive a reset code"));
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

        String email = request.getEmail().toLowerCase().trim();
        String code = request.getCode();

        // Rate limiting: 5 attempts per email per hour
        String rateLimitKey = "reset_password:" + email;
        if (!rateLimitService.tryAcquire(rateLimitKey, 5, Duration.ofHours(1))) {
            throw new AuthException("Too many attempts, please try later", HttpStatus.TOO_MANY_REQUESTS);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("Invalid email or code", HttpStatus.BAD_REQUEST));

        boolean validCode = verificationService.validatePasswordResetCode(user.getId(), code);

        if (!validCode) {
            throw new AuthException("Invalid or expired reset code", HttpStatus.BAD_REQUEST);
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Mark code as used
        verificationService.markPasswordResetUsed(user.getId(), code);

        // Terminate all sessions for security
        sessionService.terminateAllUserSessions(user.getId());

        log.info("Password reset successful for: {}", email);

        return ResponseEntity.ok(new MessageResponse("Password reset successfully. Please log in again."));
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