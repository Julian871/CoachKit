package com.coachkit.auth.service;

import com.coachkit.auth.dto.response.SessionResponse;
import com.coachkit.auth.entity.User;

import java.util.List;
import java.util.UUID;

public interface SessionService {

    String createSession(User user, String deviceName, String ip, String userAgent);

    UUID terminateSession(String refreshTokenHash);

    void terminateAllUserSessions(UUID userId);

    List<SessionResponse> getActiveSessions(UUID userId, String currentRefreshTokenHash);

    UUID validateAndGetUserId(String refreshTokenHash);

    String rotateSession(String oldRefreshToken, String deviceName, String ip, String userAgent);

    boolean terminateSessionById(UUID sessionId, UUID userId);
}