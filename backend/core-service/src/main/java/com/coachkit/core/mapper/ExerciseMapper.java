package com.coachkit.core.mapper;

import com.coachkit.core.dto.request.ExerciseRequest;
import com.coachkit.core.dto.response.ExerciseResponse;
import com.coachkit.core.entity.Exercise;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExerciseMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "active", ignore = true)
    Exercise toEntity(ExerciseRequest request);

    ExerciseResponse toResponse(Exercise exercise);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "active", ignore = true)
    void updateEntity(@MappingTarget Exercise entity, ExerciseRequest request);

    default Exercise.BodyRegion map(String value) {
        return value == null ? null : Exercise.BodyRegion.valueOf(value);
    }

    default Exercise.MuscleGroup mapMuscleGroup(String value) {
        return value == null ? null : Exercise.MuscleGroup.valueOf(value);
    }

    default Exercise.MovementPattern mapMovementPattern(String value) {
        return value == null ? null : Exercise.MovementPattern.valueOf(value);
    }

    default String map(Exercise.BodyRegion value) {
        return value == null ? null : value.name();
    }

    default String map(Exercise.MuscleGroup value) {
        return value == null ? null : value.name();
    }

    default String map(Exercise.MovementPattern value) {
        return value == null ? null : value.name();
    }
}