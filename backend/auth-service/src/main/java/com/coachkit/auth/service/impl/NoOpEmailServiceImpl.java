package com.coachkit.auth.service.impl;

import com.coachkit.auth.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NoOpEmailServiceImpl implements EmailService {

    @Override
    public void sendVerificationEmail(String toEmail, String userName, String code) {
        log.info("[EMAIL] Verification code for {} ({}): {}", toEmail, userName, code);
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String userName, String code) {
        log.info("[EMAIL] Password reset code for {} ({}): {}", toEmail, userName, code);
    }
}