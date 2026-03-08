package com.coachkit.auth.service;

import com.coachkit.auth.entity.User;

import java.util.UUID;

public interface VerificationService {

    /**
     * Creates new email verification code (6 digits, 15 min TTL).
     * Invalidates previous unused codes for this user.
     * Returns plaintext code for email sending.
     */
    String createEmailVerification(User user);

    /**
     * Verifies email code, marks user as emailVerified=true.
     * Returns true if successful, false if invalid/expired.
     */
    boolean verifyEmail(UUID userId, String code);

    /**
     * Creates new password reset code (6 digits, 60 min TTL).
     * Invalidates previous unused codes for this user.
     * Returns plaintext code for email sending.
     */
    String createPasswordReset(User user);

    /**
     * Validates password reset code without marking as used.
     * Returns true if valid and not expired.
     */
    boolean validatePasswordResetCode(UUID userId, String code);

    /**
     * Marks password reset code as used.
     * Call after successful password change.
     */
    void markPasswordResetUsed(UUID userId, String code);

    /**
     * Cleans up expired or used verification codes.
     * Called by scheduled task.
     */
    void cleanupExpiredCodes();
}