package com.company.project.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC Configuration
 * 
 * Configures web-related settings including static resource handling
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.dir}")
    private String uploadDir;
    
    /**
     * Configures resource handlers for serving static content
     * 
     * Maps URL paths to physical file system locations
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Map /images/** URL to the physical file location
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadDir);
    }
} 