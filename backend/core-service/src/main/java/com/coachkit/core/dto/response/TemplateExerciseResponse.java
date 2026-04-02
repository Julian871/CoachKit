package com.coachkit.core.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
@Schema(description = "Exercise in template response")
public class TemplateExerciseResponse {

    @Schema(description = "Template exercise unique identifier")
    private UUID id;

    @Schema(description = "Exercise order index")
    private Integer orderIndex;

    @Schema(description = "Exercise details")
    private ExerciseResponse exercise;
}