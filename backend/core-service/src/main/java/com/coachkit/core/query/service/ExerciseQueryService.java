package com.coachkit.core.query.service;

import com.coachkit.core.dto.request.ExerciseFilterRequest;
import com.coachkit.core.dto.response.ExercisePageResponse;
import com.coachkit.core.dto.response.ExerciseResponse;

import java.util.UUID;

public interface ExerciseQueryService {

    ExercisePageResponse getExercises(UUID userId, ExerciseFilterRequest filter);

    ExerciseResponse getExerciseById(UUID userId, UUID exerciseId);
}