package com.coachkit.core.repository;

import com.coachkit.core.entity.Template;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class TemplateSpecification {

    public static Specification<Template> filterBy(UUID userId, String name) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("active"), true));
            predicates.add(cb.equal(root.get("userId"), userId));

            Optional.ofNullable(name)
                    .filter(n -> !n.isBlank())
                    .ifPresent(n -> predicates.add(
                            cb.like(cb.lower(root.get("name")), "%" + n.toLowerCase() + "%")
                    ));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}