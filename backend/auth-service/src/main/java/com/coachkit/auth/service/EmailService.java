package com.coachkit.auth.service;

public interface EmailService {

    /**
     * Sends email verification code to user.
     */
    void sendVerificationEmail(String toEmail, String userName, String code);

    /**
     * Sends password reset code to user.
     */
    void sendPasswordResetEmail(String toEmail, String userName, String code);
}