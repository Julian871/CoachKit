package com.coachkit.core.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestCookieException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Custom business exceptions
    @ExceptionHandler(CoreException.class)
    public ResponseEntity<Object> handleAuthException(CoreException ex) {
        Map<String, Object> body = createErrorBody(ex.getStatus(), ex.getMessage());
        return new ResponseEntity<>(body, ex.getStatus());
    }

    // 2. Empty request body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleMessageNotReadable(HttpMessageNotReadableException ex) {
        String message = "Request body is required";

        if (ex.getMessage() != null && ex.getMessage().contains("Required request body is missing")) {
            message = "Request body is missing";
        } else if (ex.getMessage() != null && ex.getMessage().contains("JSON parse error")) {
            message = "Invalid JSON format";
        }

        Map<String, Object> body = createErrorBody(HttpStatus.BAD_REQUEST, message);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // 3. Missing cookie
    @ExceptionHandler(MissingRequestCookieException.class)
    public ResponseEntity<Object> handleMissingCookie(MissingRequestCookieException ex) {
        Map<String, Object> body = createErrorBody(
                HttpStatus.UNAUTHORIZED,
                "Required cookie '" + ex.getCookieName() + "' is not present"
        );
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    // 4. Missing header
    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<Object> handleMissingHeader(MissingRequestHeaderException ex) {
        Map<String, Object> body = createErrorBody(
                HttpStatus.UNAUTHORIZED,
                "Required header '" + ex.getHeaderName() + "' is not present"
        );
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    // 5. JWT errors (Nimbus/Spring Security)
    @ExceptionHandler(BadJwtException.class)
    public ResponseEntity<Object> handleBadJwt(BadJwtException ex) {
        String message = "Invalid token";
        if (ex.getMessage() != null && ex.getMessage().contains("expired")) {
            message = "Token has expired";
        }
        Map<String, Object> body = createErrorBody(HttpStatus.UNAUTHORIZED, message);
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    // 6. Other JWT errors
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Object> handleJwtException(JwtException ex) {
        Map<String, Object> body = createErrorBody(HttpStatus.UNAUTHORIZED, "Token validation failed");
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    // 7. Invalid credentials
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentials(BadCredentialsException ex) {
        Map<String, Object> body = createErrorBody(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    // 8. General auth errors
    @ExceptionHandler({AuthenticationException.class, InsufficientAuthenticationException.class})
    public ResponseEntity<Object> handleAuthenticationException(AuthenticationException ex) {
        Map<String, Object> body = createErrorBody(HttpStatus.UNAUTHORIZED, "Authentication required");
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    // 9. Access denied
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedException(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());

        Map<String, Object> body = createErrorBody(HttpStatus.FORBIDDEN, "Access denied");
        body.put("path", getCurrentPath());

        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    // 10. DTO validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Validation Failed");
        body.put("messages", errors);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // 11. Type mismatch (e.g., invalid UUID)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Object> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = "Invalid parameter format";
        if (ex.getRequiredType() == UUID.class) {
            message = "Invalid UUID format: " + ex.getValue();
        }
        Map<String, Object> body = createErrorBody(HttpStatus.BAD_REQUEST, message);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // 12. All other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGenericException(Exception ex) {
        log.error("Unhandled exception: ", ex);

        Map<String, Object> body = createErrorBody(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred"
        );
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // === Helper methods ===

    private Map<String, Object> createErrorBody(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return body;
    }

    private String getCurrentPath() {
        try {
            return ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes()))
                    .getRequest().getRequestURI();
        } catch (Exception e) {
            return "unknown";
        }
    }
}