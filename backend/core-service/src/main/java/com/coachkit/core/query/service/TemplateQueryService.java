package com.coachkit.core.query.service;

import com.coachkit.core.dto.request.TemplateFilterRequest;
import com.coachkit.core.dto.response.TemplatePageResponse;
import com.coachkit.core.dto.response.TemplateResponse;

import java.util.UUID;

public interface TemplateQueryService {

    TemplatePageResponse getTemplates(UUID userId, TemplateFilterRequest filter);

    TemplateResponse getTemplateById(UUID userId, UUID templateId);
}