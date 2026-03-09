package com.coachkit.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description = "Request to resend verification email (no body needed, user from token)")
@Data
public class ResendVerificationRequest {
    // Empty - user identified from Authorization header
}