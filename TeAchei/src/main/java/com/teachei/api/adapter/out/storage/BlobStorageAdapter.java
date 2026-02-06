package com.teachei.api.adapter.out.storage;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.teachei.api.application.ports.out.BlobStoragePort;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.util.Base64;
import java.util.UUID;

/**
 * Azure Blob Storage adapter for uploading and managing images.
 */
@Service
public class BlobStorageAdapter implements BlobStoragePort {

    private static final Logger log = LoggerFactory.getLogger(BlobStorageAdapter.class);

    private final String connectionString;
    private final String blobEndpoint;
    private final String profilePhotosContainer;
    private final String vehiclePhotosContainer;

    private BlobServiceClient blobServiceClient;

    public BlobStorageAdapter(
            @Value("${azure.storage.connection-string}") String connectionString,
            @Value("${azure.storage.blob-endpoint}") String blobEndpoint,
            @Value("${azure.storage.containers.profile-photos}") String profilePhotosContainer,
            @Value("${azure.storage.containers.vehicle-photos}") String vehiclePhotosContainer) {
        this.connectionString = connectionString;
        this.blobEndpoint = blobEndpoint;
        this.profilePhotosContainer = profilePhotosContainer;
        this.vehiclePhotosContainer = vehiclePhotosContainer;
    }

    @PostConstruct
    public void init() {
        try {
            this.blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(connectionString)
                    .buildClient();
            log.info("Azure Blob Storage client initialized successfully");
        } catch (Exception e) {
            log.warn("Failed to initialize Azure Blob Storage client: {}. Photo uploads will fail.", e.getMessage());
        }
    }

    @Override
    public String uploadProfilePhoto(UUID userId, String base64Image) {
        if (blobServiceClient == null) {
            log.error("Blob service client not initialized. Check AZURE_STORAGE_CONNECTION_STRING environment variable.");
            throw new RuntimeException("Serviço de armazenamento de fotos não está configurado. Contate o suporte.");
        }

        try {
            String blobName = String.format("users/%s/avatar.jpg", userId);
            String url = uploadBlob(profilePhotosContainer, blobName, base64Image);
            log.info("Profile photo uploaded for user {}: {}", userId, url);
            return url;
        } catch (IllegalArgumentException e) {
            log.error("Invalid image data for user {}: {}", userId, e.getMessage());
            throw e; // Re-throw validation errors (e.g., image too large)
        } catch (Exception e) {
            log.error("Failed to upload profile photo for user {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Falha ao enviar foto para o armazenamento: " + e.getMessage(), e);
        }
    }

    @Override
    public String uploadIntentionPhoto(String intentionId, String base64Image) {
        if (blobServiceClient == null) {
            log.error("Blob service client not initialized. Check AZURE_STORAGE_CONNECTION_STRING environment variable.");
            throw new RuntimeException("Serviço de armazenamento de fotos não está configurado. Contate o suporte.");
        }

        try {
            String blobName = String.format("intentions/%s/reference.jpg", intentionId);
            String url = uploadBlob(vehiclePhotosContainer, blobName, base64Image);
            log.info("Intention photo uploaded for intention {}: {}", intentionId, url);
            return url;
        } catch (IllegalArgumentException e) {
            log.error("Invalid image data for intention {}: {}", intentionId, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Failed to upload intention photo for {}: {}", intentionId, e.getMessage(), e);
            throw new RuntimeException("Falha ao enviar foto para o armazenamento: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteProfilePhoto(UUID userId) {
        if (blobServiceClient == null) {
            log.error("Blob service client not initialized");
            return;
        }

        try {
            String blobName = String.format("users/%s/avatar.jpg", userId);
            deleteBlob(profilePhotosContainer, blobName);
            log.info("Profile photo deleted for user {}", userId);
        } catch (Exception e) {
            log.error("Failed to delete profile photo for user {}: {}", userId, e.getMessage());
        }
    }

    @Override
    public void deleteIntentionPhoto(String intentionId) {
        if (blobServiceClient == null) {
            log.error("Blob service client not initialized");
            return;
        }

        try {
            String blobName = String.format("intentions/%s/reference.jpg", intentionId);
            deleteBlob(vehiclePhotosContainer, blobName);
            log.info("Intention photo deleted for intention {}", intentionId);
        } catch (Exception e) {
            log.error("Failed to delete intention photo for {}: {}", intentionId, e.getMessage());
        }
    }

    private String uploadBlob(String containerName, String blobName, String base64Image) {
        String cleanBase64 = removeBase64Prefix(base64Image);
        byte[] imageBytes = Base64.getDecoder().decode(cleanBase64);

        // Validate size (max 2MB)
        if (imageBytes.length > 2 * 1024 * 1024) {
            throw new IllegalArgumentException("Imagem deve ter no máximo 2MB");
        }

        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // Set content type
        BlobHttpHeaders headers = new BlobHttpHeaders()
                .setContentType("image/jpeg")
                .setCacheControl("public, max-age=31536000"); // Cache for 1 year

        blobClient.upload(new ByteArrayInputStream(imageBytes), imageBytes.length, true);
        blobClient.setHttpHeaders(headers);

        return String.format("%s/%s/%s", blobEndpoint, containerName, blobName);
    }

    private void deleteBlob(String containerName, String blobName) {
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
        BlobClient blobClient = containerClient.getBlobClient(blobName);
        blobClient.deleteIfExists();
    }

    private String removeBase64Prefix(String base64Image) {
        if (base64Image == null) {
            return "";
        }
        if (base64Image.contains(",")) {
            return base64Image.split(",")[1];
        }
        return base64Image;
    }
}
