package com.coachkit.auth.service.impl;

import com.coachkit.auth.service.RateLimitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class RateLimitServiceImpl implements RateLimitService {

    private final StringRedisTemplate redisTemplate;

    @Override
    public boolean tryAcquire(String key, int maxRequests, Duration window) {
        String redisKey = "ratelimit:" + key;
        long windowMillis = window.toMillis();
        long now = Instant.now().toEpochMilli();
        long windowStart = now - windowMillis;

        // Remove old entries outside the window
        redisTemplate.opsForZSet().removeRangeByScore(redisKey, 0, windowStart);

        // Count current requests in window
        Long currentCount = redisTemplate.opsForZSet().zCard(redisKey);

        if (currentCount != null && currentCount >= maxRequests) {
            log.warn("Rate limit exceeded for key: {}", key);
            return false;
        }

        // Add current request with score = timestamp
        redisTemplate.opsForZSet().add(redisKey, String.valueOf(now), now);

        // Set expiry on the key (auto-cleanup)
        redisTemplate.expire(redisKey, window.plusMinutes(1));

        return true;
    }

    @Override
    public boolean checkRemaining(String key, int maxRequests, Duration window) {
        String redisKey = "ratelimit:" + key;
        long windowMillis = window.toMillis();
        long now = Instant.now().toEpochMilli();
        long windowStart = now - windowMillis;

        // Clean old entries
        redisTemplate.opsForZSet().removeRangeByScore(redisKey, 0, windowStart);

        // Check current count
        Long currentCount = redisTemplate.opsForZSet().zCard(redisKey);

        return currentCount == null || currentCount < maxRequests;
    }
}