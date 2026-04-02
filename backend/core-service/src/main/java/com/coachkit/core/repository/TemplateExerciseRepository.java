package com.coachkit.core.repository;

import com.coachkit.core.entity.TemplateExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TemplateExerciseRepository extends JpaRepository<TemplateExercise, UUID> {

    @Modifying
    @Query("DELETE FROM TemplateExercise te WHERE te.template.id = :templateId")
    void deleteByTemplateId(@Param("templateId") UUID templateId);
}