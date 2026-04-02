package com.coachkit.core.repository;

import com.coachkit.core.entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TemplateRepository extends JpaRepository<Template, UUID>, JpaSpecificationExecutor<Template> {

    List<Template> findByUserIdAndActiveTrueOrderByNameAsc(UUID userId);

    Optional<Template> findByIdAndUserIdAndActiveTrue(UUID id, UUID userId);

    @Modifying
    @Query("UPDATE Template t SET t.active = false WHERE t.id = :id AND t.userId = :userId")
    int softDeleteByIdAndUserId(@Param("id") UUID id, @Param("userId") UUID userId);

    boolean existsByNameAndUserIdAndActiveTrue(String name, UUID userId);
}