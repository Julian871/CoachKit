package com.coachkit.auth.service;

import com.coachkit.auth.dto.request.DeviceInfoRequest;
import com.coachkit.auth.dto.response.SessionResponse;
import com.coachkit.auth.entity.User;

import java.util.List;
import java.util.UUID;

public interface SessionService {

    /**
     * Creates new session with hashed refresh token.
     * Called after successful login or token refresh.
     */
    String createSession(User user, DeviceInfoRequest deviceInfo, String ip, String userAgent);

    /**
     * Terminates single session by refresh token hash.
     * Returns userId for audit/logging.
     */
    UUID terminateSession(String refreshTokenHash);

    /**
     * Terminates all sessions for user (logout from all devices).
     */
    void terminateAllUserSessions(UUID userId);

    /**
     * Returns list of active sessions for user.
     * Marks current session based on provided refresh token hash.
     */
    List<SessionResponse> getActiveSessions(UUID userId, String currentRefreshTokenHash);

    /**
     * Validates refresh token exists and not expired.
     * Returns userId if valid, null if invalid/expired.
     */
    UUID validateAndGetUserId(String refreshTokenHash);
}