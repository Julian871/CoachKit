package com.coachkit.core.command.service.impl;

import com.coachkit.core.command.service.ExerciseCommandService;
import com.coachkit.core.dto.request.ExerciseRequest;
import com.coachkit.core.dto.response.ExerciseResponse;
import com.coachkit.core.entity.Exercise;
import com.coachkit.core.exception.CoreException;
import com.coachkit.core.mapper.ExerciseMapper;
import com.coachkit.core.repository.ExerciseRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ExerciseCommandServiceImpl implements ExerciseCommandService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;
    private final EntityManager entityManager;

    @Override
    public ExerciseResponse createExercise(UUID userId, ExerciseRequest request) {
        log.debug("Creating exercise for user: {}", userId);

        if (exerciseRepository.existsByNameAndUserIdAndActiveTrue(request.getName(), userId)) {
            throw new CoreException("Exercise with this name already exists", HttpStatus.CONFLICT);
        }

        Exercise exercise = exerciseMapper.toEntity(request);
        exercise.setUserId(userId);

        exercise = exerciseRepository.save(exercise);

        entityManager.flush();
        entityManager.refresh(exercise);

        log.info("Created exercise: {} for user: {}", exercise.getId(), userId);

        return exerciseMapper.toResponse(exercise);
    }

    @Override
    public ExerciseResponse updateExercise(UUID userId, UUID exerciseId, ExerciseRequest request) {
        log.debug("Updating exercise: {} for user: {}", exerciseId, userId);

        Exercise exercise = exerciseRepository.findByIdAndUserIdAndActiveTrue(exerciseId, userId)
                .orElseThrow(() -> new CoreException("Exercise not found", HttpStatus.NOT_FOUND));

        if (!exercise.getName().equals(request.getName()) &&
                exerciseRepository.existsByNameAndUserIdAndActiveTrue(request.getName(), userId)) {
            throw new CoreException("Exercise with this name already exists", HttpStatus.CONFLICT);
        }

        exerciseMapper.updateEntity(exercise, request);
        exercise = exerciseRepository.save(exercise);

        log.info("Updated exercise: {} for user: {}", exerciseId, userId);

        return exerciseMapper.toResponse(exercise);
    }

    @Override
    public void deleteExercise(UUID userId, UUID exerciseId) {
        log.debug("Soft deleting exercise: {} for user: {}", exerciseId, userId);

        int updated = exerciseRepository.softDeleteByIdAndUserId(exerciseId, userId);

        if (updated == 0) {
            throw new CoreException("Exercise not found", HttpStatus.NOT_FOUND);
        }

        log.info("Soft deleted exercise: {} for user: {}", exerciseId, userId);
    }
}