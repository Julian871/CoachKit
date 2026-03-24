package com.coachkit.auth.service.impl;

import com.coachkit.auth.dto.LoginResult;
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

import java.time.Duration;
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
    private final RateLimitService rateLimitService;

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

    @Override
    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("User not found", HttpStatus.UNAUTHORIZED));

        AuthResponse response = new AuthResponse();
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setEmailVerified(user.isEmailVerified());
        return response;
    }

    @Override
    @Transactional
    public LoginResult verifyEmail(String email, String code, String deviceName, String ip, String userAgent) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("User not found", HttpStatus.NOT_FOUND));

        boolean verified = verificationService.verifyEmail(user.getId(), code);

        if (!verified) {
            throw new AuthException("Invalid or expired verification code", HttpStatus.BAD_REQUEST);
        }

        // Create session and tokens after successful verification
        String refreshToken = sessionService.createSession(user, deviceName, ip, userAgent);
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());

        AuthResponse userInfo = new AuthResponse();
        userInfo.setAccessToken(accessToken);
        userInfo.setTokenType("Bearer");
        userInfo.setUserId(user.getId());
        userInfo.setEmail(user.getEmail());
        userInfo.setName(user.getName());
        userInfo.setEmailVerified(true);

        log.info("Email verified successfully for user: {}", email);
        return new LoginResult(accessToken, refreshToken, userInfo);
    }

    @Override
    @Transactional
    public MessageResponse resendVerification(String email, String deviceName) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthException("User not found", HttpStatus.UNAUTHORIZED));

        if (user.isEmailVerified()) {
            return new MessageResponse("Email already verified");
        }

        verificationService.createEmailVerification(user);

        return new MessageResponse("Verification email sent");
    }

    @Override
    @Transactional
    public MessageResponse forgotPassword(String email, String ip) {
        String normalizedEmail = email.toLowerCase().trim();

        // Rate limiting: 3 per email per hour, 10 per IP per hour
        String emailKey = "forgot_password:email:" + normalizedEmail;
        String ipKey = "forgot_password:ip:" + ip;

        if (!rateLimitService.tryAcquire(emailKey, 3, Duration.ofHours(1))) {
            throw new AuthException("Too many requests for this email", HttpStatus.TOO_MANY_REQUESTS);
        }

        if (!rateLimitService.tryAcquire(ipKey, 10, Duration.ofHours(1))) {
            throw new AuthException("Too many requests from this IP", HttpStatus.TOO_MANY_REQUESTS);
        }

        // Always return success to prevent email enumeration
        userRepository.findByEmail(normalizedEmail).ifPresent(user -> {
            verificationService.createPasswordReset(user);
            log.info("Password reset requested for: {}", normalizedEmail);
        });

        return new MessageResponse("If this email is registered, you will receive a reset code");
    }

    @Override
    @Transactional
    public MessageResponse resetPassword(String email, String code, String newPassword) {
        String normalizedEmail = email.toLowerCase().trim();

        // Rate limiting: 5 attempts per email per hour
        String rateLimitKey = "reset_password:" + normalizedEmail;
        if (!rateLimitService.tryAcquire(rateLimitKey, 5, Duration.ofHours(1))) {
            throw new AuthException("Too many attempts, please try later", HttpStatus.TOO_MANY_REQUESTS);
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new AuthException("Invalid email or code", HttpStatus.BAD_REQUEST));

        boolean validCode = verificationService.validatePasswordResetCode(user.getId(), code);

        if (!validCode) {
            throw new AuthException("Invalid or expired reset code", HttpStatus.BAD_REQUEST);
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark code as used
        verificationService.markPasswordResetUsed(user.getId(), code);

        // Terminate all sessions for security
        sessionService.terminateAllUserSessions(user.getId());

        log.info("Password reset successful for: {}", normalizedEmail);

        return new MessageResponse("Password reset successfully. Please log in again.");
    }
}