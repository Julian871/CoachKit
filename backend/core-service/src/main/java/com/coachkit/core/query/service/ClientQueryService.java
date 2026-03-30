package com.coachkit.core.query.service;

import com.coachkit.core.dto.response.ClientResponse;

import java.util.List;
import java.util.UUID;

public interface ClientQueryService {

    List<ClientResponse> getMyClients(UUID userId);

    ClientResponse getClientById(UUID userId, UUID clientId);
}