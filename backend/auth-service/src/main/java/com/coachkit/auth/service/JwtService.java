package com.coachkit.auth.service;

import com.coachkit.auth.dto.TokenRotationResult;
import com.coachkit.auth.entity.User;

import java.util.UUID;

/**
 * Service for JWT token operations.
 * Uses Nimbus JOSE + Spring Security OAuth2 Resource Server.
 */
public interface JwtService {

    /**
     * Generates access token for user.
     * TTL: 15 minutes from config.
     */
    String generateAccessToken(UUID userId, String email);

    /**
     * Generates refresh token, stores hash in database with user reference.
     * Returns plaintext token for cookie.
     * TTL: 7 days from config.
     */
    String generateRefreshToken(User user, String deviceName, String ip, String userAgent);

    /**
     * Validates access token and extracts user ID.
     */
    UUID validateAccessToken(String token);

    /**
     * Validates refresh token by hash lookup, rotates session (creates new, deletes old).
     * Returns user ID and new refresh token.
     */
    TokenRotationResult validateAndRotateRefreshToken(String plaintextToken, String deviceName, String ip, String userAgent);
}