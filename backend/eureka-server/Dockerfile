FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Add curl for healthcheck
RUN apk add --no-cache curl

COPY target/eureka-server-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8761

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8761/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]