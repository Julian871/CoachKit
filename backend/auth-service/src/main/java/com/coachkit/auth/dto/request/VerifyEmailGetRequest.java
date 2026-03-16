package com.coachkit.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Schema(description = "Email verification request from GET link")
@Data
public class VerifyEmailGetRequest {

    @Schema(
            description = "User email address",
            example = "ivan.petrov@example.com",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "Email is required")
    @Pattern(
            regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
            message = "Email should be valid (example: user@domain.com)"
    )
    private String email;

    @Schema(
            description = "6-digit verification code from email",
            example = "123456",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "Verification code is required")
    @Pattern(regexp = "^\\d{6}$", message = "Code must be exactly 6 digits")
    private String code;
}