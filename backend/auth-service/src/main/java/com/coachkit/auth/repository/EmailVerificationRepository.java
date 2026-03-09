package com.coachkit.auth.repository;

import com.coachkit.auth.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, UUID> {

    Optional<EmailVerification> findByUserIdAndCode(UUID userId, String code);

    @Modifying
    @Query("DELETE FROM EmailVerification v WHERE v.expiresAt < :now OR v.used = true")
    int deleteAllExpiredOrUsedBefore(Instant now);

    @Modifying
    @Query("DELETE FROM EmailVerification v WHERE v.user.id = :userId AND v.used = false")
    void deleteByUserIdAndUsedFalse(UUID userId);
}