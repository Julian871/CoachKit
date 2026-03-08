package com.coachkit.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Schema(description = "User registration request")
@Data
public class RegisterRequest {

    @Schema(
            description = "User email",
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

    @Schema(
            description = "User name",
            example = "Ivan",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minLength = 2,
            maxLength = 30
    )
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 30, message = "Name must be 2-30 characters")
    private String name;

    @Schema(
            description = "Password",
            example = "Qwerty666",
            requiredMode = Schema.RequiredMode.REQUIRED,
            minLength = 8,
            maxLength = 100
    )
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be 8-100 characters")
    private String password;
}