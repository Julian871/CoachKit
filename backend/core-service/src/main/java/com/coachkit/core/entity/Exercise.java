package com.coachkit.core.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "exercises", schema = "exercise")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "body_region", nullable = false, length = 20)
    private BodyRegion bodyRegion;

    @Enumerated(EnumType.STRING)
    @Column(name = "muscle_group", nullable = false, length = 30)
    private MuscleGroup muscleGroup;

    @Column(name = "target_muscle", length = 50)
    private String targetMuscle;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_pattern", length = 20)
    private MovementPattern movementPattern;

    @Column(length = 500)
    private String description;

    @Column(name = "video_url", length = 255)
    private String videoUrl;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum BodyRegion {
        UPPER, LOWER, CORE, FULL_BODY
    }

    public enum MuscleGroup {
        CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, FOREARMS,
        QUADRICEPS, HAMSTRINGS, GLUTES, CALVES, ADDUCTORS, ABDUCTORS,
        ABS, LOWER_BACK, OBLIQUES, FULL_BODY, OTHER
    }

    public enum MovementPattern {
        PUSH, PULL, SQUAT, HINGE, LUNGE, ROTATION, CARRY, EXPLOSIVE, OTHER
    }
}