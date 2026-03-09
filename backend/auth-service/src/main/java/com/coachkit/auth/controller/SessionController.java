package com.coachkit.auth.controller;

import com.coachkit.auth.dto.response.SessionResponse;
import com.coachkit.auth.exception.AuthException;
import com.coachkit.auth.service.JwtService;
import com.coachkit.auth.service.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
@Tag(name = "Sessions", description = "Manage active user sessions")
@SecurityRequirement(name = "bearerAuth")
public class SessionController {

    private final SessionService sessionService;
    private final JwtService jwtService;

    @Value("${coachkit.auth.cookie.refresh-name:refresh_token}")
    private String refreshCookieName;

    @GetMapping
    @Operation(summary = "List active sessions", description = "Returns all active sessions for current user")
    @ApiResponse(responseCode = "200", description = "List of sessions")
    public ResponseEntity<List<SessionResponse>> getActiveSessions(
            @RequestHeader("Authorization") String authHeader,
            HttpServletRequest request) {

        String accessToken = extractBearerToken(authHeader);
        UUID userId = jwtService.validateAccessToken(accessToken);

        // Get current refresh token hash from cookie to mark current session
        String currentRefreshHash = extractRefreshTokenHashFromCookie(request);

        List<SessionResponse> sessions = sessionService.getActiveSessions(userId, currentRefreshHash);
        return ResponseEntity.ok(sessions);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Terminate specific session", description = "Logout from another device by session ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Session terminated"),
            @ApiResponse(responseCode = "400", description = "Cannot terminate current session"),
            @ApiResponse(responseCode = "404", description = "Session not found or not owned by user")
    })
    public ResponseEntity<Void> terminateSession(
            @PathVariable
            @Parameter(description = "Session ID to terminate") UUID id,
            @RequestHeader("Authorization") String authHeader,
            HttpServletRequest request) {

        String accessToken = extractBearerToken(authHeader);
        UUID userId = jwtService.validateAccessToken(accessToken);

        // Prevent terminating current session
        String currentRefreshHash = extractRefreshTokenHashFromCookie(request);
        List<SessionResponse> sessions = sessionService.getActiveSessions(userId, currentRefreshHash);

        boolean isCurrentSession = sessions.stream()
                .filter(SessionResponse::isCurrent)
                .findFirst()
                .map(SessionResponse::getId)
                .map(currentId -> currentId.equals(id))
                .orElse(false);

        if (isCurrentSession) {
            throw new AuthException("Use /logout to terminate current session", HttpStatus.BAD_REQUEST);
        }

        // Verify session belongs to user and terminate
        boolean terminated = sessionService.terminateSessionById(id, userId);
        if (!terminated) {
            throw new AuthException("Session not found", HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.noContent().build();
    }

    // Helper methods
    private String extractBearerToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AuthException("Authorization header required", HttpStatus.UNAUTHORIZED);
        }
        return authHeader.substring(7);
    }

    private String extractRefreshTokenHashFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (refreshCookieName.equals(cookie.getName())) {
                    return jwtService.hashToken(cookie.getValue());
                }
            }
        }
        return null; // No cookie found (e.g., token already expired)
    }
}