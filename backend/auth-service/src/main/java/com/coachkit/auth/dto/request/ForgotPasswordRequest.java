package com.coachkit.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Schema(description = "Password reset request - sends code to email")
@Data
public class ForgotPasswordRequest {

    @Schema(
            description = "User email address",
            example = "ivan.petrov@example.com",
            requiredMode = Schema.RequiredMode.REQUIRED,
            format = "email"
    )
    @NotBlank(message = "Email is required")
    @Pattern(
            regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
            message = "Email should be valid (example: user@domain.com)"
    )
    private String email;
}