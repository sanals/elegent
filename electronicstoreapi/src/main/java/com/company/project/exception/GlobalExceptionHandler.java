package com.company.project.exception;

import com.company.project.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception ex) {
        return new ResponseEntity<>(
            new ApiResponse<>("ERROR", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An unexpected error occurred", ex.getMessage()),
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<String>> handleBadCredentialsException(BadCredentialsException ex) {
        return new ResponseEntity<>(
            new ApiResponse<>("ERROR", HttpStatus.UNAUTHORIZED.value(),
                "Invalid credentials", null),
            HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<String>> handleValidationException(MethodArgumentNotValidException ex) {
        return new ResponseEntity<>(
            new ApiResponse<>("ERROR", HttpStatus.BAD_REQUEST.value(),
                "Validation failed", ex.getBindingResult().getAllErrors().get(0).getDefaultMessage()),
            HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<String>> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return new ResponseEntity<>(
            new ApiResponse<>("ERROR", HttpStatus.CONFLICT.value(),
                ex.getMessage(), null),
            HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return new ResponseEntity<>(
            new ApiResponse<>("ERROR", HttpStatus.NOT_FOUND.value(),
                ex.getMessage(), null),
            HttpStatus.NOT_FOUND
        );
    }
} 