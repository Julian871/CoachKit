package com.coachkit.core.repository;

import com.coachkit.core.entity.Exercise;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class ExerciseSpecification {

    public static Specification<Exercise> filterBy(
            UUID userId,
            String name,  // <-- Добавь параметр
            Exercise.BodyRegion bodyRegion,
            Exercise.MuscleGroup muscleGroup,
            Exercise.MovementPattern movementPattern) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Обязательные условия
            predicates.add(cb.equal(root.get("active"), true));
            predicates.add(cb.equal(root.get("userId"), userId));

            // Поиск по имени (частичное совпадение, без учета регистра)
            Optional.ofNullable(name)
                    .filter(n -> !n.isBlank())
                    .ifPresent(n -> predicates.add(
                            cb.like(cb.lower(root.get("name")), "%" + n.toLowerCase() + "%")
                    ));

            // Остальные фильтры
            Optional.ofNullable(bodyRegion)
                    .ifPresent(val -> predicates.add(cb.equal(root.get("bodyRegion"), val)));

            Optional.ofNullable(muscleGroup)
                    .ifPresent(val -> predicates.add(cb.equal(root.get("muscleGroup"), val)));

            Optional.ofNullable(movementPattern)
                    .ifPresent(val -> predicates.add(cb.equal(root.get("movementPattern"), val)));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}