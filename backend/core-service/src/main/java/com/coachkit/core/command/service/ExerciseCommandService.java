package com.coachkit.core.command.service;

import com.coachkit.core.dto.request.ExerciseRequest;
import com.coachkit.core.dto.response.ExerciseResponse;

import java.util.UUID;

public interface ExerciseCommandService {

    ExerciseResponse createExercise(UUID userId, ExerciseRequest request);

    ExerciseResponse updateExercise(UUID userId, UUID exerciseId, ExerciseRequest request);

    void deleteExercise(UUID userId, UUID exerciseId);
}
