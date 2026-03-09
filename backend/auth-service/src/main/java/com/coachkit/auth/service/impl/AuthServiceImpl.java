package com.coachkit.auth.service.impl;

import com.coachkit.auth.dto.LoginResult;
import com.coachkit.auth.dto.request.LoginRequest;
import com.coachkit.auth.dto.request.RegisterRequest;
import com.coachkit.auth.dto.response.AuthResponse;
import com.coachkit.auth.dto.response.MessageResponse;
import com.coachkit.auth.entity.User;
import com.coachkit.auth.exception.AuthException;
import com.coachkit.auth.repository.UserRepository;
import com.coachkit.auth.service.AuthService;
import com.coachkit.auth.service.JwtService;
import com.coachkit.auth.service.SessionService;
import com.coachkit.auth.service.VerificationService;
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
    public MessageResponse register(RegisterRequest request, String deviceName, String ip, String userAgent) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email already registered", HttpStatus.CONFLICT);
        }

        User user = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .emailVerified(false)
                .active(true)
                .build();

        userRepository.save(user);
        verificationService.createEmailVerification(user);

        log.info("Registered new user: {}", user.getEmail());
        return new MessageResponse("Verification email sent. Check your inbox.");
    }

    @Override
    @Transactional
    public LoginResult login(LoginRequest request, String deviceName, String ip, String userAgent) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!user.isActive()) {
            throw new AuthException("Account deactivated", HttpStatus.FORBIDDEN);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        if (!user.isEmailVerified()) {
            throw new AuthException("Email not verified", HttpStatus.FORBIDDEN);
        }

        String refreshToken = sessionService.createSession(user, deviceName, ip, userAgent);
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());

        AuthResponse userInfo = new AuthResponse();
        userInfo.setAccessToken(accessToken);
        userInfo.setTokenType("Bearer");
        userInfo.setUserId(user.getId());
        userInfo.setEmail(user.getEmail());
        userInfo.setName(user.getName());
        userInfo.setEmailVerified(user.isEmailVerified());

        log.info("User logged in: {}", user.getEmail());
        return new LoginResult(accessToken, refreshToken, userInfo);
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
        UUID userId = jwtService.validateAccessToken(accessToken);
        sessionService.terminateAllUserSessions(userId);
        log.info("User logged out from all devices: {}", userId);
    }

    @Override
    @Transactional
    public LoginResult refresh(String refreshToken, String deviceName, String ip, String userAgent) {
        String newRefreshToken = sessionService.rotateSession(refreshToken, deviceName, ip, userAgent);

        String newHash = jwtService.hashToken(newRefreshToken);
        UUID userId = sessionService.validateAndGetUserId(newHash);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found", HttpStatus.UNAUTHORIZED));

        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());

        AuthResponse userInfo = new AuthResponse();
        userInfo.setAccessToken(accessToken);
        userInfo.setTokenType("Bearer");
        userInfo.setUserId(user.getId());
        userInfo.setEmail(user.getEmail());
        userInfo.setName(user.getName());
        userInfo.setEmailVerified(user.isEmailVerified());

        log.debug("Token refreshed for user: {}", user.getEmail());
        return new LoginResult(accessToken, newRefreshToken, userInfo);
    }
}