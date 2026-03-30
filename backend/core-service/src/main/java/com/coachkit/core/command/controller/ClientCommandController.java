package com.coachkit.core.command.controller;

import com.coachkit.core.command.service.ClientCommandService;
import com.coachkit.core.dto.request.ClientRequest;
import com.coachkit.core.dto.response.ClientResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/v1/clients")
@RequiredArgsConstructor
@Tag(name = "Client Commands", description = "Client write operations")
public class ClientCommandController {

    private final ClientCommandService clientCommandService;

    @PostMapping
    @Operation(summary = "Create a new client")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Client created"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "409", description = "Email already exists")
    })
    public ResponseEntity<ClientResponse> createClient(
            @AuthenticationPrincipal UUID userId,
            @Valid @RequestBody ClientRequest request) {

        ClientResponse response = clientCommandService.createClient(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{clientId}")
    @Operation(summary = "Update a client")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Client updated"),
            @ApiResponse(responseCode = "404", description = "Client not found"),
            @ApiResponse(responseCode = "409", description = "Email already exists")
    })
    public ResponseEntity<ClientResponse> updateClient(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID clientId,
            @Valid @RequestBody ClientRequest request) {

        ClientResponse client = clientCommandService.updateClient(userId, clientId, request);
        return ResponseEntity.ok(client);
    }

    @DeleteMapping("/{clientId}")
    @Operation(summary = "Delete a client (soft delete)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Client deleted"),
            @ApiResponse(responseCode = "404", description = "Client not found")
    })
    public ResponseEntity<Void> deleteClient(
            @AuthenticationPrincipal UUID userId,
            @PathVariable UUID clientId) {

        clientCommandService.deleteClient(userId, clientId);
        return ResponseEntity.noContent().build();
    }
}