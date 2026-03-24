package com.coachkit.auth.service;

import com.coachkit.auth.dto.LoginResult;
import com.coachkit.auth.dto.request.LoginRequest;
import com.coachkit.auth.dto.request.RegisterRequest;
import com.coachkit.auth.dto.response.AuthResponse;
import com.coachkit.auth.dto.response.MessageResponse;

import java.util.UUID;

public interface AuthService {

    /**
     * Registers new user, creates email verification code.
     */
    MessageResponse register(RegisterRequest request, String deviceName, String ip, String userAgent);

    /**
     * Authenticates user, creates session.
     * Returns access token (JSON) and refresh token (cookie).
     */
    LoginResult login(LoginRequest request, String deviceName, String ip, String userAgent);

    /**
     * Logs out from current device by refresh token.
     */
    void logout(String refreshToken);

    /**
     * Logs out from all devices by access token.
     */
    void logoutAll(String accessToken);

    /**
     * Refreshes access token using refresh token rotation.
     */
    LoginResult refresh(String refreshToken, String deviceName, String ip, String userAgent);

    AuthResponse getCurrentUser(UUID userId);

    /**
     * Verifies email using code from email link.
     * Public endpoint - no authentication required.
     * Returns LoginResult to automatically log in the user after verification.
     */
    LoginResult verifyEmail(String email, String code, String deviceName, String ip, String userAgent);

    MessageResponse resendVerification(String email, String deviceName);

    MessageResponse forgotPassword(String email, String ip);

    MessageResponse resetPassword(String email, String code, String newPassword);
}