package com.coachkit.core.query.controller;

import com.coachkit.core.dto.response.ClientResponse;
import com.coachkit.core.query.service.ClientQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/clients")
@RequiredArgsConstructor
@Tag(name = "Client Queries", description = "Client read operations")
public class ClientQueryController {

    private final ClientQueryService clientQueryService;

    @GetMapping
    @Operation(summary = "Get all clients for the authenticated trainer")
    @ApiResponse(responseCode = "200", description = "List of clients")
    public ResponseEntity<List<ClientResponse>> getMyClients(
            @AuthenticationPrincipal UUID userId) {

        List<ClientResponse> clients = clientQueryService.getMyClients(userId);
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/{clientId}")
    @Operation(summary = "Get a specific client by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Client found"),
            @ApiResponse(responseCode = "404", description = "Client not found")
    })
    public ResponseEntity<ClientResponse> getClientById(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID clientId) {

        ClientResponse client = clientQueryService.getClientById(userId, clientId);
        return ResponseEntity.ok(client);
    }
}