package com.coachkit.core.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Exercise creation/update request")
public class ExerciseRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Schema(description = "Exercise name", example = "Жим штанги лёжа", maxLength = 100, requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @NotNull(message = "Body region is required")
    @Pattern(
            regexp = "UPPER|LOWER|CORE|FULL_BODY",
            message = "Body region must be one of: UPPER, LOWER, CORE, FULL_BODY"
    )
    @Schema(description = "Body region", example = "UPPER", requiredMode = Schema.RequiredMode.REQUIRED)
    private String bodyRegion;

    @NotNull(message = "Muscle group is required")
    @Pattern(
            regexp = "CHEST|BACK|SHOULDERS|BICEPS|TRICEPS|FOREARMS|QUADRICEPS|HAMSTRINGS|GLUTES|CALVES|ADDUCTORS|ABDUCTORS|ABS|LOWER_BACK|OBLIQUES|FULL_BODY|OTHER",
            message = "Muscle group is invalid"
    )
    @Schema(description = "Target muscle group", example = "CHEST", requiredMode = Schema.RequiredMode.REQUIRED)
    private String muscleGroup;

    @Size(max = 50, message = "Target muscle must not exceed 50 characters")
    @Schema(description = "Specific target muscle", example = "Большая грудная", maxLength = 50, requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String targetMuscle;

    @NotNull(message = "Movement pattern is required")
    @Pattern(
            regexp = "PUSH|PULL|SQUAT|HINGE|LUNGE|ROTATION|CARRY|EXPLOSIVE|OTHER",
            message = "Movement pattern must be one of: PUSH, PULL, SQUAT, HINGE, LUNGE, ROTATION, CARRY, EXPLOSIVE, OTHER"
    )
    @Schema(description = "Movement pattern", example = "PUSH", requiredMode = Schema.RequiredMode.REQUIRED)
    private String movementPattern;


    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Schema(description = "Exercise description", example = "Классическое упражнение на грудные мышцы", maxLength = 500, requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String description;

    @Size(max = 255, message = "Video URL must not exceed 255 characters")
    @Schema(description = "Video demonstration URL", example = "https://coachkit.com/videos/bench-press.mp4", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String videoUrl;

    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    @Schema(description = "Exercise image URL", example = "https://coachkit.com/images/bench-press.png", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    private String imageUrl;
}