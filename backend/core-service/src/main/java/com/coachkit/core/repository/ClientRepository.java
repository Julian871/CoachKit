package com.coachkit.core.repository;

import com.coachkit.core.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClientRepository extends JpaRepository<Client, UUID> {

    List<Client> findByUserIdAndActiveTrueOrderByNameAsc(UUID userId);

    Optional<Client> findByIdAndUserIdAndActiveTrue(UUID id, UUID userId);

    boolean existsByUserIdAndEmailAndActiveTrue(UUID userId, String email);

    @Modifying
    @Transactional
    @Query("UPDATE Client c SET c.active = false WHERE c.id = :id AND c.userId = :userId")
    int softDeleteByIdAndUserId(@Param("id") UUID id, @Param("userId") UUID userId);
}