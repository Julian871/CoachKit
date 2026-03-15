package com.coachkit.auth.service.impl;

import com.coachkit.auth.dto.response.SessionResponse;
import com.coachkit.auth.entity.User;
import com.coachkit.auth.entity.UserSession;
import com.coachkit.auth.exception.AuthException;
import com.coachkit.auth.repository.UserSessionRepository;
import com.coachkit.auth.service.JwtService;
import com.coachkit.auth.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {

    private final UserSessionRepository userSessionRepository;
    private final JwtService jwtService;

    @Value("${coachkit.auth.jwt.refresh-token-ttl}")
    private Duration refreshTokenTtl;

    @Override
    @Transactional
    public String createSession(User user, String deviceName, String ip, String userAgent) {
        String plaintextToken = jwtService.generateRandomToken();
        String tokenHash = jwtService.hashToken(plaintextToken);

        UserSession session = UserSession.builder()
                .user(user)
                .refreshTokenHash(tokenHash)
                .deviceName(deviceName)
                .ip(ip)
                .userAgent(userAgent)
                .expiresAt(Instant.now().plus(refreshTokenTtl))
                .build();

        userSessionRepository.save(session);
        log.debug("Created session {} for user {}", session.getId(), user.getId());

        return plaintextToken;
    }

    @Override
    @Transactional
    public UUID terminateSession(String refreshTokenHash) {
        UserSession session = userSessionRepository
                .findByRefreshTokenHash(refreshTokenHash)
                .orElse(null);

        if (session == null) {
            log.warn("Session not found for hash: {}", refreshTokenHash.substring(0, 10) + "...");
            return null;
        }

        UUID userId = session.getUser().getId();
        userSessionRepository.delete(session);

        log.info("Terminated session {} for user {}", session.getId(), userId);
        return userId;
    }

    @Override
    @Transactional
    public void terminateAllUserSessions(UUID userId) {
        int deleted = userSessionRepository.deleteAllByUserId(userId);
        log.info("Terminated all {} sessions for user {}", deleted, userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionResponse> getActiveSessions(UUID userId, String currentRefreshTokenHash) {
        List<UserSession> sessions = userSessionRepository.findByUserId(userId);
        Instant now = Instant.now();

        return sessions.stream()
                .filter(s -> s.getExpiresAt().isAfter(now))
                .map(s -> {
                    SessionResponse dto = new SessionResponse();
                    dto.setId(s.getId());
                    dto.setDeviceName(s.getDeviceName());
                    dto.setIp(s.getIp());
                    dto.setCreatedAt(s.getCreatedAt());
                    dto.setExpiresAt(s.getExpiresAt());
                    dto.setCurrent(s.getRefreshTokenHash().equals(currentRefreshTokenHash));
                    return dto;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UUID validateAndGetUserId(String refreshTokenHash) {
        return userSessionRepository
                .findByRefreshTokenHash(refreshTokenHash)
                .filter(s -> s.getExpiresAt().isAfter(Instant.now()))
                .map(s -> s.getUser().getId())
                .orElse(null);
    }

    @Override
    @Transactional
    public String rotateSession(String oldRefreshToken, String deviceName, String ip, String userAgent) {
        String oldHash = jwtService.hashToken(oldRefreshToken);

        UserSession oldSession = userSessionRepository
                .findByRefreshTokenHash(oldHash)
                .orElseThrow(() -> new AuthException("Invalid refresh token", HttpStatus.UNAUTHORIZED));

        if (oldSession.getExpiresAt().isBefore(Instant.now())) {
            throw new AuthException("Refresh token expired", HttpStatus.UNAUTHORIZED);
        }

        User user = oldSession.getUser();
        userSessionRepository.delete(oldSession);

        String newPlaintextToken = createSession(user, deviceName, ip, userAgent);

        log.info("Rotated session for user {}", user.getId());
        return newPlaintextToken;
    }

    @Override
    @Transactional
    public boolean terminateSessionById(UUID sessionId, UUID userId) {
        return userSessionRepository.findById(sessionId)
                .filter(session -> session.getUser().getId().equals(userId))
                .map(session -> {
                    userSessionRepository.delete(session);
                    log.info("Terminated session {} for user {}", sessionId, userId);
                    return true;
                })
                .orElse(false);
    }
}