package com.coachkit.core.command.service;

import com.coachkit.core.dto.request.TemplateRequest;
import com.coachkit.core.dto.response.TemplateResponse;

import java.util.UUID;

public interface TemplateCommandService {

    TemplateResponse createTemplate(UUID userId, TemplateRequest request);

    TemplateResponse updateTemplate(UUID userId, UUID templateId, TemplateRequest request);

    void deleteTemplate(UUID userId, UUID templateId);
}