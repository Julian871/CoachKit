package com.coachkit.auth.service.impl;

import com.coachkit.auth.entity.EmailVerification;
import com.coachkit.auth.entity.PasswordReset;
import com.coachkit.auth.entity.User;
import com.coachkit.auth.repository.EmailVerificationRepository;
import com.coachkit.auth.repository.PasswordResetRepository;
import com.coachkit.auth.repository.UserRepository;
import com.coachkit.auth.service.EmailService;
import com.coachkit.auth.service.VerificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {

    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordResetRepository passwordResetRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${coachkit.auth.verification.ttl-minutes:15}")
    private int verificationTtlMinutes;

    @Value("${coachkit.auth.password-reset.ttl-minutes:60}")
    private int passwordResetTtlMinutes;

    @Override
    @Transactional
    public String createEmailVerification(User user) {
        // Invalidate previous codes
        emailVerificationRepository.deleteByUserIdAndUsedFalse(user.getId());

        // Generate 6-digit code
        String code = generateSixDigitCode();

        // Save to database
        EmailVerification verification = EmailVerification.builder()
                .user(user)
                .code(code)
                .expiresAt(Instant.now().plusSeconds(verificationTtlMinutes * 60L))
                .used(false)
                .build();

        emailVerificationRepository.save(verification);

        // Send email
        emailService.sendVerificationEmail(user.getEmail(), user.getName(), code);

        log.debug("Created email verification code for user {}", user.getId());
        return code;
    }

    @Override
    @Transactional
    public boolean verifyEmail(UUID userId, String code) {
        Optional<EmailVerification> optional = emailVerificationRepository
                .findByUserIdAndCode(userId, code);

        if (optional.isEmpty()) {
            log.warn("Invalid verification code for user {}", userId);
            return false;
        }

        EmailVerification verification = optional.get();

        if (verification.isUsed() || verification.getExpiresAt().isBefore(Instant.now())) {
            log.warn("Expired or used verification code for user {}", userId);
            return false;
        }

        // Mark as used
        verification.setUsed(true);
        emailVerificationRepository.save(verification);

        // Activate user
        User user = verification.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        log.info("Email verified for user {}", userId);
        return true;
    }

    @Override
    @Transactional
    public String createPasswordReset(User user) {
        // Invalidate previous codes
        passwordResetRepository.deleteByUserIdAndUsedFalse(user.getId());

        // Generate 6-digit code
        String code = generateSixDigitCode();

        // Save to database
        PasswordReset reset = PasswordReset.builder()
                .user(user)
                .code(code)
                .expiresAt(Instant.now().plusSeconds(passwordResetTtlMinutes * 60L))
                .used(false)
                .build();

        passwordResetRepository.save(reset);

        // Send email
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), code);

        log.debug("Created password reset code for user {}", user.getId());
        return code;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validatePasswordResetCode(UUID userId, String code) {
        Optional<PasswordReset> optional = passwordResetRepository
                .findByUserIdAndCode(userId, code);

        if (optional.isEmpty()) {
            return false;
        }

        PasswordReset reset = optional.get();
        return !reset.isUsed() && reset.getExpiresAt().isAfter(Instant.now());
    }

    @Override
    @Transactional
    public void markPasswordResetUsed(UUID userId, String code) {
        passwordResetRepository.findByUserIdAndCode(userId, code)
                .ifPresent(reset -> {
                    reset.setUsed(true);
                    passwordResetRepository.save(reset);
                    log.debug("Marked password reset code as used for user {}", userId);
                });
    }

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanupExpiredCodes() {
        Instant now = Instant.now();
        int emailDeleted = emailVerificationRepository.deleteAllExpiredOrUsedBefore(now);
        int passDeleted = passwordResetRepository.deleteAllExpiredOrUsedBefore(now);

        if (emailDeleted > 0 || passDeleted > 0) {
            log.info("Cleaned up {} expired email verifications and {} password resets",
                    emailDeleted, passDeleted);
        }
    }

    private String generateSixDigitCode() {
        return String.format("%06d", secureRandom.nextInt(1_000_000));
    }
}