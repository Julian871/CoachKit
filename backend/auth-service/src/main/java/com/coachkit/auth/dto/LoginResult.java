package com.coachkit.auth.dto;

import com.coachkit.auth.dto.response.AuthResponse;

/**
 * Internal result of login/refresh operations.
 * Contains access token for JSON and refresh token for HttpOnly cookie.
 */
public record LoginResult(String accessToken, String refreshToken, AuthResponse userInfo) {
}