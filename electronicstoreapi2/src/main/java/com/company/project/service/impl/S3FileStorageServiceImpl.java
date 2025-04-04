package com.company.project.service.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.company.project.exception.FileStorageException;
import com.company.project.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "s3")
public class S3FileStorageServiceImpl implements FileStorageService {

    private final AmazonS3 s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.endpoint-url}")
    private String endpointUrl;

    public S3FileStorageServiceImpl(AmazonS3 s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String storeFile(MultipartFile file) {
        // Normalize file name
        String originalFilename = file.getOriginalFilename();
        String fileName = originalFilename != null ? StringUtils.cleanPath(originalFilename) : "unknown_filename";
        
        try {
            // Check if the file's name contains invalid characters
            if (fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }
            
            // Generate unique file name
            String uniqueFileName = "images/" + UUID.randomUUID().toString() + "_" + fileName;
            
            // Set metadata
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());
            
            // Upload to S3
            PutObjectRequest putRequest = new PutObjectRequest(
                    bucketName, 
                    uniqueFileName, 
                    file.getInputStream(), 
                    metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead);
            
            s3Client.putObject(putRequest);
            
            // Construct the file URL
            return endpointUrl + "/" + bucketName + "/" + uniqueFileName;
            
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        try {
            // Extract key from the URL: https://s3.amazonaws.com/bucket/images/file.jpg
            String key = fileUrl.substring(fileUrl.indexOf(bucketName) + bucketName.length() + 1);
            s3Client.deleteObject(bucketName, key);
        } catch (Exception ex) {
            throw new FileStorageException("Could not delete file from S3. Please try again!", ex);
        }
    }

    @Override
    public String getFileType() {
        return "s3";
    }
} 