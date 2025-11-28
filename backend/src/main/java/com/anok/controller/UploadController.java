package com.anok.controller;

import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping
public class UploadController {

    private final S3Presigner s3Presigner;
    private final String bucketName;
    private final String keyPrefix;
    private final Duration presignDuration;

    public UploadController(
            @Value("${aws.s3.bucket}") String bucketName,
            @Value("${aws.s3.region}") String region,
            @Value("${aws.s3.prefix}") String keyPrefix,
            @Value("${aws.s3.presign-expiration-minutes}") long presignExpirationMinutes) {

        this.bucketName = bucketName;
        this.keyPrefix = keyPrefix;
        this.presignDuration = Duration.ofMinutes(presignExpirationMinutes);

        // AWS SDK automatically uses default credential provider chain:
        // 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) - for production
        // 2. SSO credentials from ~/.aws/config - for local development
        this.s3Presigner = S3Presigner.builder()
                .region(Region.of(region))
                .build();
    }

    @PostMapping(value = "/upload-flyer",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> uploadFlyer(
            @RequestParam(value = "filename", required = false) String originalFilename,
            @RequestParam(value = "contentType", required = false) String contentType) {

        try {
            String ext = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = UUID.randomUUID() + ext;
            String objectKey = keyPrefix + filename;

            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .contentType(contentType != null && !contentType.isBlank()
                            ? contentType
                            : "application/octet-stream")
                    .build();

            PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(
                    PutObjectPresignRequest.builder()
                            .signatureDuration(presignDuration)
                            .putObjectRequest(putRequest)
                            .build()
            );

            return ResponseEntity.ok(Map.of(
                    "uploadUrl", presigned.url().toString(),
                    "bucket", bucketName,
                    "key", objectKey,
                    "expiresInSeconds", String.valueOf(presignDuration.toSeconds())
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Upload failed", "details", e.getMessage()));
        }
    }

    @PreDestroy
    public void close() {
        s3Presigner.close();
    }
}
