package com.company.project.controller;

import com.company.project.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller
 * 
 * Provides endpoints to check the health and status of the application.
 * These endpoints can be used by monitoring tools or load balancers to verify
 * that the application is running properly.
 */
@RestController
@RequestMapping("/health")
@RequiredArgsConstructor
public class HealthController {

    @Value("${spring.application.name}")
    private String applicationName;
    
    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    /**
     * Simple health check endpoint
     * Returns a 200 OK response if the application is running
     * 
     * @return Success response
     */
    @GetMapping
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(
            new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "Application is running", "OK")
        );
    }

    /**
     * Detailed health information endpoint
     * Returns more detailed information about the application status
     * 
     * @return Detailed health information
     */
    @GetMapping("/info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> healthInfo() {
        Map<String, Object> healthData = new HashMap<>();
        healthData.put("application", applicationName);
        healthData.put("profile", activeProfile);
        healthData.put("status", "UP");
        healthData.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(
            new ApiResponse<>("SUCCESS", HttpStatus.OK.value(), "Health information", healthData)
        );
    }
} 