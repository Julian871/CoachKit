package com.coachkit.core.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Schema(description = "Template creation/update request")
public class TemplateRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Schema(description = "Template name", example = "Тренировка груди", maxLength = 100, requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Schema(description = "Template description", example = "Базовая тренировка на грудные мышцы", maxLength = 500, requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String description;

    @NotEmpty(message = "At least one exercise is required")
    @Schema(description = "List of exercise IDs in order", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<@Valid TemplateExerciseRequest> exercises;
}