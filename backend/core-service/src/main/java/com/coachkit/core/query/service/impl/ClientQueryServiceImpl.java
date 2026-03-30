package com.coachkit.core.query.service.impl;

import com.coachkit.core.dto.response.ClientResponse;
import com.coachkit.core.entity.Client;
import com.coachkit.core.exception.CoreException;
import com.coachkit.core.mapper.ClientMapper;
import com.coachkit.core.repository.ClientRepository;
import com.coachkit.core.query.service.ClientQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ClientQueryServiceImpl implements ClientQueryService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    @Override
    public List<ClientResponse> getMyClients(UUID userId) {
        log.debug("Fetching all clients for user: {}", userId);

        return clientRepository.findByUserIdAndActiveTrueOrderByNameAsc(userId)
                .stream()
                .map(clientMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ClientResponse getClientById(UUID userId, UUID clientId) {
        log.debug("Fetching client: {} for user: {}", clientId, userId);

        Client client = clientRepository.findByIdAndUserIdAndActiveTrue(clientId, userId)
                .orElseThrow(() -> new CoreException("Client not found", HttpStatus.NOT_FOUND));

        return clientMapper.toResponse(client);
    }
}