package com.coachkit.auth.health;

import com.netflix.appinfo.InstanceInfo;
import com.netflix.discovery.EurekaClient;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component("customEurekaHealthIndicator")
@RequiredArgsConstructor
public class EurekaHealthIndicator implements HealthIndicator {

    private final EurekaClient eurekaClient;

    @Override
    public Health health() {
        try {
            String appName = "AUTH-SERVICE";
            InstanceInfo instanceInfo = eurekaClient.getNextServerFromEureka(appName, false);

            return Health.up()
                    .withDetail("eureka", "registered")
                    .withDetail("status", instanceInfo.getStatus().toString())
                    .withDetail("instanceId", instanceInfo.getInstanceId())
                    .build();
        } catch (Exception e) {
            return Health.down()
                    .withDetail("eureka", "not registered")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}