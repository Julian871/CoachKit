package com.coachkit.core.command.service;

import com.coachkit.core.dto.request.ClientRequest;
import com.coachkit.core.dto.response.ClientResponse;

import java.util.UUID;

public interface ClientCommandService {

    ClientResponse createClient(UUID userId, ClientRequest request);

    ClientResponse updateClient(UUID userId, UUID clientId, ClientRequest request);

    void deleteClient(UUID userId, UUID clientId);
}