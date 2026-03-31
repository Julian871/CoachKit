package com.coachkit.core.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@Schema(description = "Client response")
public class ClientResponse {

    @Schema(description = "Client unique identifier")
    private UUID id;

    @Schema(description = "Client full name")
    private String name;

    @Schema(description = "Instagram username")
    private String instagram;

    @Schema(description = "Client phone number")
    private String phone;

    @Schema(description = "Telegram username")
    private String telegram;

    @Schema(description = "Avatar emoji")
    private String avatar;

    @Schema(description = "Client birth date")
    private LocalDate birthDate;

    @Schema(description = "Additional notes")
    private String notes;

    @Schema(description = "Whether client is active")
    private boolean active;

    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Last update timestamp")
    private LocalDateTime updatedAt;
}