package com.coachkit.core.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
@Schema(description = "Client creation/update request")
public class ClientRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Schema(description = "Client full name", example = "John Doe", maxLength = 100)
    private String name;

    @Email(message = "Invalid email format")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Schema(description = "Client email", example = "john.doe@example.com")
    private String email;

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    @Schema(description = "Client phone number", example = "+1234567890")
    private String phone;

    @Schema(description = "Client birth date", example = "1990-01-01")
    private LocalDate birthDate;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    @Schema(description = "Additional notes about client", maxLength = 2000)
    private String notes;
}