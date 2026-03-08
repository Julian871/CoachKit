package com.coachkit.auth.dto;

import java.util.UUID;

public record TokenRotationResult(UUID userId, String newRefreshToken) {
}