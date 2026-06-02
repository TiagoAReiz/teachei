package com.teachei.api.shared.storage;

import java.util.UUID;

/**
 * Port for blob storage operations.
 * Handles upload and deletion of images in Azure Blob Storage.
 */
public interface BlobStoragePort {

    /**
     * Uploads a profile photo for a user.
     * @param userId the user's UUID
     * @param base64Image the image in Base64 format (with or without data:image prefix)
     * @return the public URL of the uploaded image
     */
    String uploadProfilePhoto(UUID userId, String base64Image);

    /**
     * Uploads a reference photo for a purchase intention.
     * @param intentionId the intention's ID
     * @param base64Image the image in Base64 format
     * @return the public URL of the uploaded image
     */
    String uploadIntentionPhoto(String intentionId, String base64Image);

    /**
     * Deletes a user's profile photo.
     * @param userId the user's UUID
     */
    void deleteProfilePhoto(UUID userId);

    /**
     * Deletes the reference photo for an intention.
     * @param intentionId the intention's ID
     */
    void deleteIntentionPhoto(String intentionId);
}
