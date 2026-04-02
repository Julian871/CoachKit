package com.coachkit.core.query.controller;

import com.coachkit.core.dto.request.TemplateFilterRequest;
import com.coachkit.core.dto.response.TemplatePageResponse;
import com.coachkit.core.dto.response.TemplateResponse;
import com.coachkit.core.query.service.TemplateQueryService;
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
@RequestMapping("/v1/templates")
@RequiredArgsConstructor
@Tag(name = "Template Queries", description = "Template read operations")
public class TemplateQueryController {

    private final TemplateQueryService templateQueryService;

    @GetMapping
    @Operation(summary = "Get all templates with filters and pagination")
    @ApiResponse(responseCode = "200", description = "Paginated list of templates")
    public ResponseEntity<TemplatePageResponse> getTemplates(
            @AuthenticationPrincipal UUID userId,
            @ModelAttribute TemplateFilterRequest filter) {

        log.debug("Fetching templates for user: {} with filter: {}", userId, filter);
        TemplatePageResponse templates = templateQueryService.getTemplates(userId, filter);
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/{templateId}")
    @Operation(summary = "Get a specific template by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Template found"),
            @ApiResponse(responseCode = "404", description = "Template not found")
    })
    public ResponseEntity<TemplateResponse> getTemplateById(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID templateId) {

        log.debug("Fetching template: {} for user: {}", templateId, userId);
        TemplateResponse template = templateQueryService.getTemplateById(userId, templateId);
        return ResponseEntity.ok(template);
    }
}