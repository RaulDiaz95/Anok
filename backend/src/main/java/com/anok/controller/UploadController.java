package com.anok.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.anok.service.S3Service;
import com.anok.service.S3Service.UploadPresign;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;

import java.util.Map;

@RestController
@RequestMapping
public class UploadController {

    private static final Logger log = LoggerFactory.getLogger(UploadController.class);
    private final S3Service s3Service;

    public UploadController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping(value = "/upload-flyer",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> uploadFlyer(
            @RequestParam(value = "filename", required = false) String originalFilename,
            @RequestParam(value = "contentType", required = false) String contentType) {

        try {
            UploadPresign uploadPresign = s3Service.createUploadPresign(originalFilename, contentType);
            PresignedPutObjectRequest presigned = uploadPresign.presignedRequest();

            return ResponseEntity.ok(Map.of(
                    "uploadUrl", presigned.url().toString(),
                    "bucket", s3Service.getBucketName(),
                    "key", uploadPresign.objectKey(),
                    "expiresInSeconds", String.valueOf(s3Service.getPresignDuration().toSeconds())
            ));

        } catch (Exception e) {
            log.error("Failed to create upload presign URL", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Unable to generate upload URL. Please try again later."));
        }
    }

}
