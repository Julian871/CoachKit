package com.coachkit.core.query.service.impl;

import com.coachkit.core.dto.request.ExerciseFilterRequest;
import com.coachkit.core.dto.response.ExercisePageResponse;
import com.coachkit.core.dto.response.ExerciseResponse;
import com.coachkit.core.entity.Exercise;
import com.coachkit.core.exception.CoreException;
import com.coachkit.core.mapper.ExerciseMapper;
import com.coachkit.core.query.service.ExerciseQueryService;
import com.coachkit.core.repository.ExerciseRepository;
import com.coachkit.core.repository.ExerciseSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExerciseQueryServiceImpl implements ExerciseQueryService {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;

    @Override
    public ExercisePageResponse getExercises(UUID userId, ExerciseFilterRequest filter) {
        log.debug("Fetching exercises for user: {} with filters: {}", userId, filter);

        Pageable pageable = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by("name").ascending()
        );

        Page<Exercise> exercisePage = exerciseRepository.findAll(
                ExerciseSpecification.filterBy(
                        userId,
                        filter.getName(),
                        filter.getBodyRegion(),
                        filter.getMuscleGroup(),
                        filter.getMovementPattern()
                ),
                pageable
        );

        return ExercisePageResponse.builder()
                .content(exercisePage.getContent().stream()
                        .map(exerciseMapper::toResponse)
                        .collect(Collectors.toList()))
                .page(exercisePage.getNumber())
                .size(exercisePage.getSize())
                .totalElements(exercisePage.getTotalElements())
                .totalPages(exercisePage.getTotalPages())
                .hasNext(exercisePage.hasNext())
                .hasPrevious(exercisePage.hasPrevious())
                .build();
    }

    @Override
    public ExerciseResponse getExerciseById(UUID userId, UUID exerciseId) {
        log.debug("Fetching exercise: {} for user: {}", exerciseId, userId);

        Exercise exercise = exerciseRepository.findByIdAndUserIdAndActiveTrue(exerciseId, userId)
                .orElseThrow(() -> new CoreException("Exercise not found", HttpStatus.NOT_FOUND));

        return exerciseMapper.toResponse(exercise);
    }
}