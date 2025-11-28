package com.anok.controller;

import jakarta.annotation.PreDestroy;
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

    public UploadController() {
        this.bucketName = requireEnv("S3_BUCKET");
        String region = requireEnv("AWS_REGION");
        this.keyPrefix = System.getenv().getOrDefault("S3_PREFIX", "uploads/flyers/");
        this.presignDuration = resolvePresignDuration();

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

    private Duration resolvePresignDuration() {
        String minutes = System.getenv("S3_PRESIGN_EXP_MINUTES");
        if (minutes == null || minutes.isBlank()) {
            return Duration.ofMinutes(15);
        }
        try {
            long value = Long.parseLong(minutes);
            return Duration.ofMinutes(Math.max(1, value));
        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid S3_PRESIGN_EXP_MINUTES value: " + minutes);
        }
    }

    private String requireEnv(String name) {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Missing required environment variable: " + name);
        }
        return value;
    }

    @PreDestroy
    public void close() {
        s3Presigner.close();
    }
}
