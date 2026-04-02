package com.coachkit.core.mapper;

import com.coachkit.core.dto.request.TemplateExerciseRequest;
import com.coachkit.core.dto.request.TemplateRequest;
import com.coachkit.core.dto.response.TemplateExerciseResponse;
import com.coachkit.core.dto.response.TemplateResponse;
import com.coachkit.core.entity.Exercise;
import com.coachkit.core.entity.Template;
import com.coachkit.core.entity.TemplateExercise;
import org.mapstruct.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = ExerciseMapper.class)
public interface TemplateMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "exercises", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "active", ignore = true)
    Template toEntity(TemplateRequest request);

    @Mapping(target = "exercises", source = "exercises")
    TemplateResponse toResponse(Template template);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "exercises", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "active", ignore = true)
    void updateEntity(@MappingTarget Template entity, TemplateRequest request);

    // TemplateExercise mappings
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "template", ignore = true)
    @Mapping(target = "exercise", source = "exerciseId", qualifiedByName = "exerciseFromId")
    TemplateExercise toTemplateExerciseEntity(TemplateExerciseRequest request);

    @Mapping(target = "exercise", source = "exercise")
    TemplateExerciseResponse toTemplateExerciseResponse(TemplateExercise templateExercise);

    @Named("exerciseFromId")
    default Exercise exerciseFromId(UUID exerciseId) {
        if (exerciseId == null) return null;
        return Exercise.builder().id(exerciseId).build();
    }

    default List<TemplateExercise> toTemplateExerciseList(List<TemplateExerciseRequest> requests) {
        if (requests == null) return null;
        return requests.stream()
                .map(this::toTemplateExerciseEntity)
                .collect(Collectors.toList());
    }
}