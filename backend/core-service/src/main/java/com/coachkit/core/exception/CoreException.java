package com.coachkit.core.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CoreException extends RuntimeException {

    private final HttpStatus status;

    public CoreException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public CoreException(String message, HttpStatus status, Throwable cause) {
        super(message, cause);
        this.status = status;
    }
}