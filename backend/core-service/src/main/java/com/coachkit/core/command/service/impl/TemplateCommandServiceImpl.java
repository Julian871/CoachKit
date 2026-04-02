package com.coachkit.core.command.service.impl;

import com.coachkit.core.command.service.TemplateCommandService;
import com.coachkit.core.dto.request.TemplateRequest;
import com.coachkit.core.dto.response.TemplateResponse;
import com.coachkit.core.entity.Exercise;
import com.coachkit.core.entity.Template;
import com.coachkit.core.entity.TemplateExercise;
import com.coachkit.core.exception.CoreException;
import com.coachkit.core.mapper.TemplateMapper;
import com.coachkit.core.repository.ExerciseRepository;
import com.coachkit.core.repository.TemplateExerciseRepository;
import com.coachkit.core.repository.TemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TemplateCommandServiceImpl implements TemplateCommandService {

    private final TemplateRepository templateRepository;
    private final TemplateExerciseRepository templateExerciseRepository;
    private final ExerciseRepository exerciseRepository;
    private final TemplateMapper templateMapper;

    @Override
    public TemplateResponse createTemplate(UUID userId, TemplateRequest request) {
        log.debug("Creating template for user: {}", userId);

        if (templateRepository.existsByNameAndUserIdAndActiveTrue(request.getName(), userId)) {
            throw new CoreException("Template with this name already exists", HttpStatus.CONFLICT);
        }

        Template template = templateMapper.toEntity(request);
        template.setUserId(userId);
        template.setActive(true);

        List<TemplateExercise> exercises = createTemplateExercises(request, template);
        template.setExercises(exercises);

        Template saved = templateRepository.save(template);
        return templateMapper.toResponse(saved);
    }

    @Override
    public TemplateResponse updateTemplate(UUID userId, UUID templateId, TemplateRequest request) {
        log.debug("Updating template: {} for user: {}", templateId, userId);

        Template template = templateRepository.findByIdAndUserIdAndActiveTrue(templateId, userId)
                .orElseThrow(() -> new CoreException("Template not found", HttpStatus.NOT_FOUND));

        if (!template.getName().equals(request.getName()) &&
                templateRepository.existsByNameAndUserIdAndActiveTrue(request.getName(), userId)) {
            throw new CoreException("Template with this name already exists", HttpStatus.CONFLICT);
        }

        templateMapper.updateEntity(template, request);

        template.getExercises().clear();
        templateRepository.saveAndFlush(template);

        List<TemplateExercise> exercises = createTemplateExercises(request, template);
        template.getExercises().addAll(exercises);

        Template saved = templateRepository.save(template);
        return templateMapper.toResponse(saved);
    }

    @Override
    public void deleteTemplate(UUID userId, UUID templateId) {
        log.debug("Deleting template: {} for user: {}", templateId, userId);

        int updated = templateRepository.softDeleteByIdAndUserId(templateId, userId);
        if (updated == 0) {
            throw new CoreException("Template not found", HttpStatus.NOT_FOUND);
        }
    }

    private List<TemplateExercise> createTemplateExercises(TemplateRequest request, Template template) {
        return request.getExercises().stream()
                .map(teRequest -> {
                    Exercise exercise = exerciseRepository
                            .findByIdAndUserIdAndActiveTrue(teRequest.getExerciseId(), template.getUserId())
                            .orElseThrow(() -> new CoreException(
                                    "Exercise not found: " + teRequest.getExerciseId(),
                                    HttpStatus.BAD_REQUEST));

                    return TemplateExercise.builder()
                            .template(template)
                            .exercise(exercise)
                            .orderIndex(teRequest.getOrderIndex())
                            .build();
                })
                .collect(Collectors.toList());
    }
}