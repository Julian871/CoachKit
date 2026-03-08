package com.coachkit.auth.service.impl;

import com.coachkit.auth.dto.TokenRotationResult;
import com.coachkit.auth.entity.User;
import com.coachkit.auth.entity.UserSession;
import com.coachkit.auth.exception.AuthException;
import com.coachkit.auth.repository.UserSessionRepository;
import com.coachkit.auth.service.JwtService;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.proc.SecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private final UserSessionRepository userSessionRepository;

    @Value("${coachkit.auth.jwt.secret}")
    private String jwtSecret;

    @Value("${coachkit.auth.jwt.access-token-ttl}")
    private Duration accessTokenTtl;

    @Value("${coachkit.auth.jwt.refresh-token-ttl}")
    private Duration refreshTokenTtl;

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
    @Transactional
    public String generateRefreshToken(User user, String deviceName, String ip, String userAgent) {
        // Generate random token
        String plaintextToken = UUID.randomUUID() + "-" + System.nanoTime();
        String tokenHash = hashToken(plaintextToken);

        // Save to database
        UserSession session = UserSession.builder()
                .user(user)
                .refreshTokenHash(tokenHash)
                .deviceName(deviceName)
                .ip(ip)
                .userAgent(userAgent)
                .expiresAt(Instant.now().plus(refreshTokenTtl))
                .build();

        userSessionRepository.save(session);

        return plaintextToken;
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
    @Transactional
    public TokenRotationResult validateAndRotateRefreshToken(String plaintextToken, String deviceName, String ip, String userAgent) {
        String tokenHash = hashToken(plaintextToken);

        UserSession oldSession = userSessionRepository
                .findByRefreshTokenHash(tokenHash)
                .orElseThrow(() -> new AuthException("Refresh token not found", HttpStatus.UNAUTHORIZED));

        if (oldSession.getExpiresAt().isBefore(Instant.now())) {
            throw new AuthException("Refresh token expired", HttpStatus.UNAUTHORIZED);
        }

        User user = oldSession.getUser();

        // Delete old session
        userSessionRepository.delete(oldSession);

        // Create new session (rotation)
        String newPlaintextToken = generateRefreshToken(user, deviceName, ip, userAgent);

        return new TokenRotationResult(user.getId(), newPlaintextToken);
    }

    private void validateTokenType(Jwt jwt) {
        String type = jwt.getClaimAsString("type");
        if (!"access".equals(type)) {
            throw new AuthException("Invalid token type", HttpStatus.UNAUTHORIZED);
        }
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}