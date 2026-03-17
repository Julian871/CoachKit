package com.coachkit.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class FallbackController {

    @GetMapping("/fallback/auth")
    public Mono<ResponseEntity<String>> authFallback() {
        return Mono.just(ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Auth service is temporarily unavailable. Please try again later."));
    }

    @GetMapping("/fallback/core")
    public Mono<ResponseEntity<String>> coreFallback() {
        return Mono.just(ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Core service is temporarily unavailable. Please try again later."));
    }

    @GetMapping("/fallback/notification")
    public Mono<ResponseEntity<String>> notificationFallback() {
        return Mono.just(ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Notification service is temporarily unavailable. Please try again later."));
    }
}