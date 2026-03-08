package com.coachkit.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.UUID;

@Schema(description = "Authentication response with access token")
@Data
public class AuthResponse {

    @Schema(
            description = "JWT access token (15 min TTL)",
            example = "eyJhbGciOiJIUzI1NiIs..."
    )
    private String accessToken;

    @Schema(
            description = "Token type",
            example = "Bearer"
    )
    private String tokenType = "Bearer";

    @Schema(
            description = "User ID",
            example = "550e8400-e29b-41d4-a716-446655440000"
    )
    private UUID userId;

    @Schema(
            description = "User email",
            example = "ivan.petrov@example.com"
    )
    private String email;

    @Schema(
            description = "User name",
            example = "Ivan"
    )
    private String name;

    @Schema(
            description = "Is email verified",
            example = "false"
    )
    private boolean emailVerified;
}