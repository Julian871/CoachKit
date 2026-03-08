package com.coachkit.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Schema(description = "Device information for session tracking")
@Data
public class DeviceInfoRequest {

    @Schema(
            description = "Human-readable device name (provided by client)",
            example = "iPhone 15 - Chrome",
            maxLength = 100
    )
    @Size(max = 100, message = "Device name must not exceed 100 characters")
    private String deviceName;
}