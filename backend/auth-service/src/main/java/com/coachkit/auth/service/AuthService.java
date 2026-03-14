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

    MessageResponse verifyEmail(UUID userId, String code);

    MessageResponse resendVerification(UUID userId, String deviceName);
}