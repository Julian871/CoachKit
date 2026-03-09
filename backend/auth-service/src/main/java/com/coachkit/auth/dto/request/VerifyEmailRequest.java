package com.coachkit.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Schema(description = "Email verification request with 6-digit code")
@Data
public class VerifyEmailRequest {

    @Schema(
            description = "6-digit verification code from email",
            example = "123456",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minLength = 6,
            maxLength = 6
    )
    @NotBlank(message = "Verification code is required")
    @Pattern(regexp = "^\\d{6}$", message = "Code must be exactly 6 digits")
    private String code;
}