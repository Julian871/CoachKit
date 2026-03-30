package com.coachkit.core.command.service.impl;

import com.coachkit.core.command.service.ClientCommandService;
import com.coachkit.core.dto.request.ClientRequest;
import com.coachkit.core.dto.response.ClientResponse;
import com.coachkit.core.entity.Client;
import com.coachkit.core.exception.CoreException;
import com.coachkit.core.mapper.ClientMapper;
import com.coachkit.core.repository.ClientRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ClientCommandServiceImpl implements ClientCommandService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final EntityManager entityManager;

    @Override
    public ClientResponse createClient(UUID userId, ClientRequest request) {
        log.debug("Creating client for user: {}", userId);

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (clientRepository.existsByUserIdAndEmailAndActiveTrue(userId, request.getEmail())) {
                throw new CoreException("Client with this email already exists", HttpStatus.CONFLICT);
            }
        }

        Client client = clientMapper.toEntity(request);
        client.setUserId(userId);

        client = clientRepository.save(client);

        // Refresh to get generated fields (createdAt, updatedAt)
        entityManager.flush();
        entityManager.refresh(client);

        log.info("Created client: {} for user: {}", client.getId(), userId);

        return clientMapper.toResponse(client);
    }

    @Override
    public ClientResponse updateClient(UUID userId, UUID clientId, ClientRequest request) {
        log.debug("Updating client: {} for user: {}", clientId, userId);

        Client client = clientRepository.findByIdAndUserIdAndActiveTrue(clientId, userId)
                .orElseThrow(() -> new CoreException("Client not found", HttpStatus.NOT_FOUND));

        if (request.getEmail() != null && !request.getEmail().isBlank() &&
                !request.getEmail().equals(client.getEmail())) {
            if (clientRepository.existsByUserIdAndEmailAndActiveTrue(userId, request.getEmail())) {
                throw new CoreException("Client with this email already exists", HttpStatus.CONFLICT);
            }
        }

        clientMapper.updateEntity(client, request);
        client = clientRepository.save(client);

        log.info("Updated client: {} for user: {}", clientId, userId);

        return clientMapper.toResponse(client);
    }

    @Override
    public void deleteClient(UUID userId, UUID clientId) {
        log.debug("Soft deleting client: {} for user: {}", clientId, userId);

        int updated = clientRepository.softDeleteByIdAndUserId(clientId, userId);

        if (updated == 0) {
            throw new CoreException("Client not found", HttpStatus.NOT_FOUND);
        }

        log.info("Soft deleted client: {} for user: {}", clientId, userId);
    }
}