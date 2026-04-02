package com.coachkit.core.repository;

import com.coachkit.core.entity.Exercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID>, JpaSpecificationExecutor<Exercise> {

    Optional<Exercise> findByIdAndUserIdAndActiveTrue(UUID id, UUID userId);

    @Modifying
    @Query("UPDATE Exercise e SET e.active = false WHERE e.id = :id AND e.userId = :userId")
    int softDeleteByIdAndUserId(@Param("id") UUID id, @Param("userId") UUID userId);

    boolean existsByNameAndUserIdAndActiveTrue(String name, UUID userId);

    Page<Exercise> findAll(Specification<Exercise> spec, Pageable pageable);
}