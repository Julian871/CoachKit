package com.coachkit.auth.service;

import com.coachkit.auth.dto.request.DeviceInfoRequest;
import com.coachkit.auth.dto.response.SessionResponse;
import com.coachkit.auth.entity.User;

import java.util.List;
import java.util.UUID;

public interface SessionService {

    String createSession(User user, DeviceInfoRequest deviceInfo, String ip, String userAgent);

    UUID terminateSession(String refreshTokenHash);

    void terminateAllUserSessions(UUID userId);

    List<SessionResponse> getActiveSessions(UUID userId, String currentRefreshTokenHash);

    UUID validateAndGetUserId(String refreshTokenHash);

    /**
     * Validates old refresh token, deletes old session, creates new one.
     * Returns new plaintext refresh token.
     */
    String rotateSession(String oldRefreshToken, DeviceInfoRequest deviceInfo, String ip, String userAgent);
}