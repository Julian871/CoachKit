package com.coachkit.auth.service.impl;

import com.coachkit.auth.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    private String loadTemplate(String templateName) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/" + templateName);
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Failed to load email template: {}", templateName, e);
            throw new RuntimeException("Failed to load email template", e);
        }
    }

    @Override
    public void sendVerificationEmail(String toEmail, String userName, String code) {
        try {
            String verificationLink = "http://192.168.100.6:5173/verify-email?" +
                    "email=" + toEmail +
                    "&code=" + code;

            String template = loadTemplate("email-verification.html");
            String content = template
                    .replace("${userName}", userName)
                    .replace("${verificationUrl}", verificationLink);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("CoachKit: Подтверждение email");
            helper.setText(content, true);

            mailSender.send(message);
            log.info("Verification email sent to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String userName, String code) {
        try {
            String template = loadTemplate("password-reset.html");
            String content = template
                    .replace("${userName}", userName)
                    .replace("${userEmail}", toEmail)
                    .replace("${resetCode}", code);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("CoachKit: Код для сброса пароля");
            helper.setText(content, true);

            mailSender.send(message);
            log.info("Password reset email sent to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
}