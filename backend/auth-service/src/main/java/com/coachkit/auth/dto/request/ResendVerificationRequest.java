package com.coachkit.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Schema(description = "Request to resend verification email")
@Data
public class ResendVerificationRequest {
    @Schema(
            description = "User email",
            example = "ivan.petrov@example.com",
            requiredMode = Schema.RequiredMode.REQUIRED,
            format = "email"
    )
    @NotBlank(message = "Email is required")
    private String email;
}