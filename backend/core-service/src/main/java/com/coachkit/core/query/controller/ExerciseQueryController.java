package com.coachkit.core.query.controller;

import com.coachkit.core.dto.request.ExerciseFilterRequest;
import com.coachkit.core.dto.response.ExercisePageResponse;
import com.coachkit.core.dto.response.ExerciseResponse;
import com.coachkit.core.query.service.ExerciseQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/exercises")
@RequiredArgsConstructor
@Tag(name = "Exercise Queries", description = "Exercise read operations")
public class ExerciseQueryController {

    private final ExerciseQueryService exerciseQueryService;

    @GetMapping
    @Operation(summary = "Get all exercises with filters and pagination")
    @ApiResponse(responseCode = "200", description = "Paginated list of exercises")
    public ResponseEntity<ExercisePageResponse> getExercises(
            @AuthenticationPrincipal UUID userId,
            @ModelAttribute ExerciseFilterRequest filter) {

        log.debug("Fetching exercises for user: {} with filters: {}", userId, filter);
        ExercisePageResponse exercises = exerciseQueryService.getExercises(userId, filter);
        return ResponseEntity.ok(exercises);
    }

    @GetMapping("/{exerciseId}")
    @Operation(summary = "Get a specific exercise by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Exercise found"),
            @ApiResponse(responseCode = "404", description = "Exercise not found")
    })
    public ResponseEntity<ExerciseResponse> getExerciseById(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID exerciseId) {

        log.debug("Fetching exercise: {} for user: {}", exerciseId, userId);
        ExerciseResponse exercise = exerciseQueryService.getExerciseById(userId, exerciseId);
        return ResponseEntity.ok(exercise);
    }
}