package com.coachkit.core.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@Schema(description = "Template response")
public class TemplateResponse {

    @Schema(description = "Template unique identifier")
    private UUID id;

    @Schema(description = "Template name")
    private String name;

    @Schema(description = "Template description")
    private String description;

    @Schema(description = "Exercises in template (ordered)")
    private List<TemplateExerciseResponse> exercises;

    @Schema(description = "Whether template is active")
    private boolean active;

    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Last update timestamp")
    private LocalDateTime updatedAt;
}