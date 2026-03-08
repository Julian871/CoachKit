package com.coachkit.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "Active session information")
@Data
public class SessionResponse {

    @Schema(
            description = "Session ID",
            example = "550e8400-e29b-41d4-a716-446655440000"
    )
    private UUID id;

    @Schema(
            description = "Device name",
            example = "iPhone 15 - Chrome"
    )
    private String deviceName;

    @Schema(
            description = "IP address",
            example = "192.168.1.100"
    )
    private String ip;

    @Schema(
            description = "Session created at",
            example = "2026-03-09T14:30:00Z"
    )
    private Instant createdAt;

    @Schema(
            description = "Session expires at",
            example = "2026-03-16T14:30:00Z"
    )
    private Instant expiresAt;

    @Schema(
            description = "Is current session (user's current device)",
            example = "true"
    )
    private boolean current;
}