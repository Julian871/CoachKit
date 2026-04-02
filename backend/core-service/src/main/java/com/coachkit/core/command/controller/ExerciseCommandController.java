package com.coachkit.core.command.controller;

import com.coachkit.core.command.service.ExerciseCommandService;
import com.coachkit.core.dto.request.ExerciseRequest;
import com.coachkit.core.dto.response.ExerciseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/exercises")
@RequiredArgsConstructor
@Tag(name = "Exercise Commands", description = "Exercise write operations")
public class ExerciseCommandController {

    private final ExerciseCommandService exerciseCommandService;

    @PostMapping
    @Operation(summary = "Create a new exercise")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Exercise created"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "409", description = "Exercise with this name already exists")
    })
    public ResponseEntity<ExerciseResponse> createExercise(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody ExerciseRequest request) {

        ExerciseResponse response = exerciseCommandService.createExercise(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{exerciseId}")
    @Operation(summary = "Update an exercise")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Exercise updated"),
            @ApiResponse(responseCode = "404", description = "Exercise not found"),
            @ApiResponse(responseCode = "409", description = "Exercise with this name already exists")
    })
    public ResponseEntity<ExerciseResponse> updateExercise(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID exerciseId,
            @Valid @RequestBody ExerciseRequest request) {

        ExerciseResponse exercise = exerciseCommandService.updateExercise(userId, exerciseId, request);
        return ResponseEntity.ok(exercise);
    }

    @DeleteMapping("/{exerciseId}")
    @Operation(summary = "Delete an exercise (soft delete)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Exercise deleted"),
            @ApiResponse(responseCode = "404", description = "Exercise not found")
    })
    public ResponseEntity<Void> deleteExercise(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID exerciseId) {

        exerciseCommandService.deleteExercise(userId, exerciseId);
        return ResponseEntity.noContent().build();
    }
}