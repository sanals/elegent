package com.company.project.config;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

/**
 * Jackson Configuration
 * 
 * Configures the Jackson ObjectMapper to support Java 8 date/time types
 * like LocalDateTime, LocalDate, etc.
 */
@Configuration
public class JacksonConfig {

    private static final DateTimeFormatter ISO_DATETIME_FORMATTER = DateTimeFormatter
            .ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");

    /**
     * Creates a new ObjectMapper with JavaTimeModule to support Java 8 date/time
     * types
     * and configures it to serialize LocalDateTime as ISO strings
     * 
     * @return Configured ObjectMapper
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();

        // Create JavaTimeModule with custom serializer for LocalDateTime
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addSerializer(
                LocalDateTime.class,
                new LocalDateTimeSerializer(ISO_DATETIME_FORMATTER));

        objectMapper.registerModule(javaTimeModule);

        // Disable writing dates as timestamps (arrays)
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        return objectMapper;
    }
}