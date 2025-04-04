package com.company.project.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AWS S3 Configuration
 * 
 * Configures the AWS S3 client for file storage when storage.type is set to 's3'.
 * This configuration is conditionally loaded only when S3 storage is enabled.
 * 
 * The application supports two storage types:
 * 1. Local file system (default, configured with storage.type=local)
 * 2. AWS S3 (configured with storage.type=s3)
 */
@Configuration
@ConditionalOnProperty(name = "storage.type", havingValue = "s3")
public class AwsS3Config {

    @Value("${aws.credentials.access-key}")
    private String accessKey;

    @Value("${aws.credentials.secret-key}")
    private String secretKey;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.endpoint-url}")
    private String endpointUrl;

    /**
     * Creates and configures an Amazon S3 client
     * 
     * This client is used to interact with the S3 bucket for file operations
     * like upload, download, and delete.
     * 
     * @return Configured AmazonS3 client
     */
    @Bean
    public AmazonS3 amazonS3Client() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
        
        return AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endpointUrl, region))
                .build();
    }
} 