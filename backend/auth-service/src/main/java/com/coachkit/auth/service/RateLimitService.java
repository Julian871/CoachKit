package com.coachkit.auth.service;

import java.time.Duration;

/**
 * Service for rate limiting operations.
 * Uses Redis for distributed rate limiting across instances.
 */
public interface RateLimitService {

    /**
     * Attempts to acquire a permit for the given key.
     * Implements sliding window algorithm.
     *
     * @param key         Unique identifier (e.g., "forgot_password:email@example.com")
     * @param maxRequests Maximum allowed requests in the time window
     * @param window      Time window duration
     * @return true if request is allowed, false if rate limit exceeded
     */
    boolean tryAcquire(String key, int maxRequests, Duration window);

    /**
     * Checks rate limit without incrementing counter.
     * Useful for pre-checks or warnings.
     */
    boolean checkRemaining(String key, int maxRequests, Duration window);
}