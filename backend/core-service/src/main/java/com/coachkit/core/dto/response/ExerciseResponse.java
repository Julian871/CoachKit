package com.coachkit.core.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@Schema(description = "Exercise response")
public class ExerciseResponse {

    @Schema(description = "Exercise unique identifier")
    private UUID id;

    @Schema(description = "Exercise name")
    private String name;

    @Schema(description = "Body region")
    private String bodyRegion;

    @Schema(description = "Target muscle group")
    private String muscleGroup;

    @Schema(description = "Specific target muscle")
    private String targetMuscle;

    @Schema(description = "Movement pattern")
    private String movementPattern;

    @Schema(description = "Exercise description")
    private String description;

    @Schema(description = "Video demonstration URL")
    private String videoUrl;

    @Schema(description = "Exercise image URL")
    private String imageUrl;

    @Schema(description = "Whether exercise is active")
    private boolean active;

    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Last update timestamp")
    private LocalDateTime updatedAt;
}