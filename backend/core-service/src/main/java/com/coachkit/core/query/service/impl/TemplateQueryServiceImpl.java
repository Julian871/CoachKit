package com.coachkit.core.query.service.impl;

import com.coachkit.core.dto.request.TemplateFilterRequest;
import com.coachkit.core.dto.response.TemplatePageResponse;
import com.coachkit.core.dto.response.TemplateResponse;
import com.coachkit.core.entity.Template;
import com.coachkit.core.exception.CoreException;
import com.coachkit.core.mapper.TemplateMapper;
import com.coachkit.core.query.service.TemplateQueryService;
import com.coachkit.core.repository.TemplateRepository;
import com.coachkit.core.repository.TemplateSpecification;
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
public class TemplateQueryServiceImpl implements TemplateQueryService {

    private final TemplateRepository templateRepository;
    private final TemplateMapper templateMapper;

    @Override
    public TemplatePageResponse getTemplates(UUID userId, TemplateFilterRequest filter) {
        log.debug("Fetching templates for user: {} with filter: {}", userId, filter);

        Pageable pageable = PageRequest.of(
                filter.getPage(),
                filter.getSize(),
                Sort.by("name").ascending()
        );

        Page<Template> templatePage = templateRepository.findAll(
                TemplateSpecification.filterBy(userId, filter.getName()),
                pageable
        );

        return TemplatePageResponse.builder()
                .content(templatePage.getContent().stream()
                        .map(templateMapper::toResponse)
                        .collect(Collectors.toList()))
                .page(templatePage.getNumber())
                .size(templatePage.getSize())
                .totalElements(templatePage.getTotalElements())
                .totalPages(templatePage.getTotalPages())
                .hasNext(templatePage.hasNext())
                .hasPrevious(templatePage.hasPrevious())
                .build();
    }

    @Override
    public TemplateResponse getTemplateById(UUID userId, UUID templateId) {
        log.debug("Fetching template: {} for user: {}", templateId, userId);

        Template template = templateRepository.findByIdAndUserIdAndActiveTrue(templateId, userId)
                .orElseThrow(() -> new CoreException("Template not found", HttpStatus.NOT_FOUND));

        return templateMapper.toResponse(template);
    }
}