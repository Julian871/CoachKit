FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Add curl for healthcheck
RUN apk add --no-cache curl

COPY target/gateway-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=5s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]