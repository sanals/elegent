package com.company.project.dto.response;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.company.project.util.AppConstants;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic API Response Wrapper
 * 
 * Standardized response format for all API endpoints.
 * Contains status information, HTTP code, message, and the actual data payload.
 * 
 * @param <T> Type of data payload
 */
@Data
@NoArgsConstructor
public class ApiResponse<T> {
    private String status;
    private int code;
    private String message;
    private T data;

    // Store timestamp as a string to avoid serialization issues
    private String timestamp;

    public ApiResponse(String status, int code, String message, T data) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = DateTimeFormatter.ofPattern(AppConstants.DEFAULT_DATETIME_FORMAT).format(LocalDateTime.now());
    }
}