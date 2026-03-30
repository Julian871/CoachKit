FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Add curl for healthcheck
RUN apk add --no-cache curl

COPY target/core-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8082

HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:8082/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]