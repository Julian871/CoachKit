package com.coachkit.auth.service;

import com.coachkit.auth.dto.request.DeviceInfoRequest;
import com.coachkit.auth.dto.request.LoginRequest;
import com.coachkit.auth.dto.request.RegisterRequest;
import com.coachkit.auth.dto.response.AuthResponse;
import com.coachkit.auth.dto.response.MessageResponse;

public interface AuthService {

    /**
     * Registers new user, creates email verification code.
     * Does NOT authenticate automatically (email must be verified first).
     */
    MessageResponse register(RegisterRequest request, DeviceInfoRequest deviceInfo, String ip, String userAgent);

    /**
     * Authenticates user, creates session, returns access token.
     * Sets refresh token in HttpOnly cookie (done in controller).
     */
    AuthResponse login(LoginRequest request, DeviceInfoRequest deviceInfo, String ip, String userAgent);

    /**
     * Logs out from current device (deletes current session by refresh token).
     */
    void logout(String refreshToken);

    /**
     * Logs out from all devices (deletes all user sessions by access token).
     * Access token validated inside, user extracted.
     */
    void logoutAll(String accessToken);

    /**
     * Refreshes access token using refresh token rotation.
     * Returns new access token, old refresh deleted, new created.
     */
    AuthResponse refresh(String refreshToken, DeviceInfoRequest deviceInfo, String ip, String userAgent);
}