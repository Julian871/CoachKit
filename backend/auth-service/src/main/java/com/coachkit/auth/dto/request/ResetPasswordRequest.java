package com.coachkit.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Schema(description = "Reset password with verification code")
@Data
public class ResetPasswordRequest {

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
            description = "6-digit reset code from email",
            example = "654321",
            requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "Reset code is required")
    @Pattern(regexp = "^\\d{6}$", message = "Code must be exactly 6 digits")
    private String code;

    @Schema(
            description = "New password",
            example = "NewSecurePass123",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minLength = 8,
            maxLength = 100
    )
    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 100, message = "Password must be 8-100 characters")
    private String newPassword;
}