package com.coachkit.core.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
@Schema(description = "Exercise in template request")
public class TemplateExerciseRequest {

    @NotNull(message = "Exercise ID is required")
    @Schema(description = "Exercise ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID exerciseId;

    @NotNull(message = "Order index is required")
    @Schema(description = "Exercise order in template (0-based)", example = "0", requiredMode = Schema.RequiredMode.REQUIRED)
    private Integer orderIndex;
}