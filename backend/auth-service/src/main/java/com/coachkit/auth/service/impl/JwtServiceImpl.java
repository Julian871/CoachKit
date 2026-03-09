package com.coachkit.auth.service.impl;

import com.coachkit.auth.exception.AuthException;
import com.coachkit.auth.service.JwtService;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.proc.SecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    @Value("${coachkit.auth.jwt.secret}")
    private String jwtSecret;

    @Value("${coachkit.auth.jwt.access-token-ttl}")
    private Duration accessTokenTtl;

    private JwtEncoder jwtEncoder;
    private JwtDecoder jwtDecoder;

    private synchronized void initJwtProcessor() {
        if (jwtEncoder == null) {
            SecretKey key = new SecretKeySpec(
                    jwtSecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            ImmutableSecret<SecurityContext> secret = new ImmutableSecret<>(key);
            jwtEncoder = new NimbusJwtEncoder(secret);
            jwtDecoder = NimbusJwtDecoder.withSecretKey(key).build();
        }
    }

    @Override
    public String generateAccessToken(UUID userId, String email) {
        initJwtProcessor();

        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("coachkit-auth")
                .issuedAt(now)
                .expiresAt(now.plus(accessTokenTtl))
                .subject(userId.toString())
                .claim("email", email)
                .claim("type", "access")
                .build();

        JwsHeader header = JwsHeader.with(() -> "HS256").build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }

    @Override
    public UUID validateAccessToken(String token) {
        initJwtProcessor();

        try {
            Jwt jwt = jwtDecoder.decode(token);
            validateTokenType(jwt);
            return UUID.fromString(jwt.getSubject());
        } catch (JwtException e) {
            throw new AuthException("Invalid access token", HttpStatus.UNAUTHORIZED, e);
        }
    }

    @Override
    public String generateRandomToken() {
        return UUID.randomUUID().toString() + "-" + System.nanoTime();
    }

    @Override
    public String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    private void validateTokenType(Jwt jwt) {
        String type = jwt.getClaimAsString("type");
        if (!"access".equals(type)) {
            throw new AuthException("Invalid token type", HttpStatus.UNAUTHORIZED);
        }
    }
}