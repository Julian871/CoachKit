package com.coachkit.core.service;

import java.util.UUID;

/**
 * Service for JWT token operations.
 * Low-level: generation and validation only.
 * Session management moved to SessionService.
 */
public interface JwtService {

    /**
     * Generates access token for user.
     * TTL: 15 minutes from config.
     */
    String generateAccessToken(UUID userId, String email);

    /**
     * Validates access token and extracts user ID.
     */
    UUID validateAccessToken(String token);

    /**
     * Generates random plaintext token for refresh.
     * Format: UUID + timestamp for uniqueness.
     */
    String generateRandomToken();

    /**
     * Hashes token with SHA-256 for secure storage.
     */
    String hashToken(String token);
}