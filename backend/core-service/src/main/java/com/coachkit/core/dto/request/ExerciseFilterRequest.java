package com.coachkit.core.dto.request;

import com.coachkit.core.entity.Exercise;
import lombok.Data;

@Data
public class ExerciseFilterRequest {
    private int page = 0;
    private int size = 20;
    private String name;
    private Exercise.BodyRegion bodyRegion;
    private Exercise.MuscleGroup muscleGroup;
    private Exercise.MovementPattern movementPattern;
}
