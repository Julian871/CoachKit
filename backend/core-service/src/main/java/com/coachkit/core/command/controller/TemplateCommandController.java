package com.coachkit.core.command.controller;

import com.coachkit.core.dto.request.TemplateRequest;
import com.coachkit.core.dto.response.TemplateResponse;
import com.coachkit.core.command.service.TemplateCommandService;
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
@RequestMapping("/v1/templates")
@RequiredArgsConstructor
@Tag(name = "Template Commands", description = "Template write operations")
public class TemplateCommandController {

    private final TemplateCommandService templateCommandService;

    @PostMapping
    @Operation(summary = "Create a new template")
    @ApiResponse(responseCode = "201", description = "Template created")
    public ResponseEntity<TemplateResponse> createTemplate(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody TemplateRequest request) {

        log.info("Creating template for user: {}", userId);
        TemplateResponse created = templateCommandService.createTemplate(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{templateId}")
    @Operation(summary = "Update an existing template")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Template updated"),
            @ApiResponse(responseCode = "404", description = "Template not found")
    })
    public ResponseEntity<TemplateResponse> updateTemplate(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID templateId,
            @Valid @RequestBody TemplateRequest request) {

        log.info("Updating template: {} for user: {}", templateId, userId);
        TemplateResponse updated = templateCommandService.updateTemplate(userId, templateId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{templateId}")
    @Operation(summary = "Delete a template (soft delete)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Template deleted"),
            @ApiResponse(responseCode = "404", description = "Template not found")
    })
    public ResponseEntity<Void> deleteTemplate(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID templateId) {

        log.info("Deleting template: {} for user: {}", templateId, userId);
        templateCommandService.deleteTemplate(userId, templateId);
        return ResponseEntity.noContent().build();
    }
}