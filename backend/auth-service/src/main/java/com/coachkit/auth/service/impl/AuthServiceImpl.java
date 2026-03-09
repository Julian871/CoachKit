package com.coachkit.auth.service.impl;

import com.coachkit.auth.dto.request.DeviceInfoRequest;
import com.coachkit.auth.dto.request.LoginRequest;
import com.coachkit.auth.dto.request.RegisterRequest;
import com.coachkit.auth.dto.response.AuthResponse;
import com.coachkit.auth.dto.response.MessageResponse;
import com.coachkit.auth.entity.User;
import com.coachkit.auth.exception.AuthException;
import com.coachkit.auth.repository.UserRepository;
import com.coachkit.auth.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final SessionService sessionService;
    private final VerificationService verificationService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public MessageResponse register(RegisterRequest request, DeviceInfoRequest deviceInfo,
                                    String ip, String userAgent) {
        // Check email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email already registered", HttpStatus.CONFLICT);
        }

        // Create user
        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .emailVerified(false)
                .active(true)
                .build();

        userRepository.save(user);

        // Create verification code
        verificationService.createEmailVerification(user);

        log.info("Registered new user: {}", user.getEmail());
        return new MessageResponse("Verification email sent. Check your inbox.");
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request, DeviceInfoRequest deviceInfo,
                              String ip, String userAgent) {
        // Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        // Check active
        if (!user.isActive()) {
            throw new AuthException("Account deactivated", HttpStatus.FORBIDDEN);
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        // Check email verified (optional: can be configurable)
        if (!user.isEmailVerified()) {
            throw new AuthException("Email not verified", HttpStatus.FORBIDDEN);
        }

        // Create session (refresh token)
        String refreshToken = sessionService.createSession(user, deviceInfo, ip, userAgent);

        // Generate access token
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());

        // Build response (refresh token goes to cookie in controller)
        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setEmailVerified(user.isEmailVerified());

        log.info("User logged in: {}", user.getEmail());
        return response;
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        String hash = jwtService.hashToken(refreshToken);
        UUID userId = sessionService.terminateSession(hash);

        if (userId != null) {
            log.info("User logged out from device: {}", userId);
        }
    }

    @Override
    @Transactional
    public void logoutAll(String accessToken) {
        // Validate and extract user
        UUID userId = jwtService.validateAccessToken(accessToken);

        // Terminate all sessions
        sessionService.terminateAllUserSessions(userId);

        log.info("User logged out from all devices: {}", userId);
    }

    @Override
    @Transactional
    public AuthResponse refresh(String refreshToken, DeviceInfoRequest deviceInfo,
                                String ip, String userAgent) {
        // Rotate session: validate old, delete, create new
        String newRefreshToken = sessionService.rotateSession(refreshToken, deviceInfo, ip, userAgent);

        // Get user from new session (need to validate it)
        String newHash = jwtService.hashToken(newRefreshToken);
        UUID userId = sessionService.validateAndGetUserId(newHash);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found", HttpStatus.UNAUTHORIZED));

        // Generate new access token
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());

        // Build response
        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setTokenType("Bearer");
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setEmailVerified(user.isEmailVerified());

        // Note: newRefreshToken goes to cookie in controller
        log.debug("Token refreshed for user: {}", user.getEmail());
        return response;
    }
}