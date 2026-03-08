package com.coachkit.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(description = "Simple message response")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    @Schema(
            description = "Response message",
            example = "Verification email sent"
    )
    private String message;
}