package com.anok.service;

import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.net.URI;
import java.time.Duration;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Presigner s3Presigner;
    private final String bucketName;
    private final String keyPrefix;
    private final Duration presignDuration;

    public S3Service(
            @Value("${aws.s3.bucket}") String bucketName,
            @Value("${aws.s3.region}") String region,
            @Value("${aws.s3.prefix}") String keyPrefix,
            @Value("${aws.s3.presign-expiration-minutes}") long presignExpirationMinutes
    ) {
        this.bucketName = bucketName;
        this.keyPrefix = keyPrefix;
        this.presignDuration = Duration.ofMinutes(presignExpirationMinutes);
        this.s3Presigner = S3Presigner.builder()
                .region(Region.of(region))
                .build();
    }

    public UploadPresign createUploadPresign(String originalFilename, String contentType) {
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

        return new UploadPresign(objectKey, presigned);
    }

    public String generateSignedGetUrl(String flyerUrl) {
        if (flyerUrl == null) {
            return "";
        }
        String trimmed = flyerUrl.trim();
        if (trimmed.isEmpty()) {
            return "";
        }

        String key = extractKey(trimmed);
        if (key == null || key.isBlank()) {
            return trimmed;
        }

        try {
            PresignedGetObjectRequest presigned = s3Presigner.presignGetObject(
                    GetObjectPresignRequest.builder()
                            .signatureDuration(presignDuration)
                            .getObjectRequest(GetObjectRequest.builder()
                                    .bucket(bucketName)
                                    .key(key)
                                    .build())
                            .build()
            );
            return presigned.url().toString();
        } catch (Exception e) {
            return trimmed;
        }
    }

    private String extractKey(String url) {
        try {
            if (!url.startsWith("http")) {
                return url;
            }

            URI uri = URI.create(url);
            String host = uri.getHost();
            if (host != null && !host.contains(bucketName)) {
                return null;
            }

            String path = uri.getPath();
            if (path == null || path.isBlank()) {
                return null;
            }
            return path.startsWith("/") ? path.substring(1) : path;
        } catch (Exception e) {
            return null;
        }
    }

    public String getBucketName() {
        return bucketName;
    }

    public Duration getPresignDuration() {
        return presignDuration;
    }

    @PreDestroy
    public void close() {
        s3Presigner.close();
    }

    public record UploadPresign(String objectKey, PresignedPutObjectRequest presignedRequest) {
    }
}
