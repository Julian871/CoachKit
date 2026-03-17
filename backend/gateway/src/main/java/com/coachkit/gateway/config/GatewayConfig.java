package com.coachkit.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Auth Service routes
                .route("auth-service", r -> r
                        .path("/api/v1/auth/**", "/api/v1/sessions/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("authServiceCB")
                                        .setFallbackUri("forward:/fallback/auth"))
                                .retry(config -> config
                                        .setRetries(3)
                                        .setStatuses(HttpStatus.SERVICE_UNAVAILABLE)))
                        .uri("lb://AUTH-SERVICE"))

                // Core Service routes (когда будет готов)
                .route("core-service", r -> r
                        .path("/api/v1/workouts/**", "/api/v1/programs/**", "/api/v1/exercises/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("coreServiceCB")
                                        .setFallbackUri("forward:/fallback/core")))
                        .uri("lb://CORE-SERVICE"))

                // Notification Service routes (когда будет готов)
                .route("notification-service", r -> r
                        .path("/api/v1/notifications/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("notificationServiceCB")
                                        .setFallbackUri("forward:/fallback/notification")))
                        .uri("lb://NOTIFICATION-SERVICE"))

                // Swagger routes aggregation
                .route("swagger-auth", r -> r
                        .path("/v3/api-docs/auth")
                        .filters(f -> f.rewritePath("/v3/api-docs/auth", "/v3/api-docs"))
                        .uri("lb://AUTH-SERVICE"))

                .build();
    }
}