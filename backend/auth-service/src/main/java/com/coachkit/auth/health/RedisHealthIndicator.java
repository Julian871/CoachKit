package com.coachkit.auth.health;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisHealthIndicator implements HealthIndicator {

    private final StringRedisTemplate redisTemplate;

    @Override
    public Health health() {
        try {
            String testKey = "health:test:" + System.currentTimeMillis();
            redisTemplate.opsForValue().set(testKey, "ok", java.time.Duration.ofSeconds(5));
            String value = redisTemplate.opsForValue().get(testKey);

            if ("ok".equals(value)) {
                return Health.up()
                        .withDetail("redis", "connected")
                        .withDetail("status", "read/write ok")
                        .build();
            } else {
                return Health.down()
                        .withDetail("redis", "read/write failed")
                        .build();
            }
        } catch (Exception e) {
            return Health.down()
                    .withDetail("redis", "connection failed")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}