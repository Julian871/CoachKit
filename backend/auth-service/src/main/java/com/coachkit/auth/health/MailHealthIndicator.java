package com.coachkit.auth.health;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MailHealthIndicator implements HealthIndicator {

    private final JavaMailSenderImpl mailSender;

    @Override
    public Health health() {
        try {
            mailSender.testConnection();
            return Health.up()
                    .withDetail("mail", mailSender.getHost())
                    .withDetail("port", mailSender.getPort())
                    .withDetail("status", "connected")
                    .build();
        } catch (Exception e) {
            log.warn("Mail server health check failed: {}", e.getMessage());
            return Health.down()
                    .withDetail("mail", mailSender.getHost())
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}