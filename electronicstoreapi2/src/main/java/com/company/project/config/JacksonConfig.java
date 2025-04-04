package com.company.project.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Jackson Configuration
 * 
 * Configures the Jackson ObjectMapper to support Java 8 date/time types
 * like LocalDateTime, LocalDate, etc.
 */
@Configuration
public class JacksonConfig {

    /**
     * Creates a new ObjectMapper with JavaTimeModule to support Java 8 date/time types
     * 
     * @return Configured ObjectMapper
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }
}