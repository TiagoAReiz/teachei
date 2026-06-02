package com.teachei.api.shared.config;

import com.azure.cosmos.CosmosClient;
import com.azure.cosmos.CosmosClientBuilder;
import com.azure.cosmos.CosmosContainer;
import com.azure.cosmos.CosmosDatabase;
import com.azure.cosmos.models.CosmosItemRequestOptions;
import com.azure.cosmos.models.CosmosQueryRequestOptions;
import com.azure.cosmos.models.PartitionKey;
import com.azure.cosmos.util.CosmosPagedIterable;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * One-time migration to update legacy PENDENTE_PAGAMENTO status to ATIVO.
 *
 * <p>Disabled by default. Running this on every startup is unsafe in a
 * multi-replica deployment (all replicas race on {@code replaceItem}) and
 * costs Cosmos RUs even when there is no work to do. To execute it again,
 * set {@code app.migration.cosmos-status-migration.enabled=true} in the
 * target environment, restart a single replica (scale to 1), let it run,
 * then turn the flag back off and scale up.
 */
@Component
@ConditionalOnProperty(
    name = "app.migration.cosmos-status-migration.enabled",
    havingValue = "true"
)
public class CosmosDataMigration implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(CosmosDataMigration.class);

    private final CosmosClientBuilder cosmosClientBuilder;
    private final String database;
    private final ObjectMapper objectMapper;

    public CosmosDataMigration(
            CosmosClientBuilder cosmosClientBuilder,
            @Value("${azure.cosmos.database}") String database) {
        this.cosmosClientBuilder = cosmosClientBuilder;
        this.database = database;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.findAndRegisterModules(); // For LocalDateTime support
    }

    @Override
    public void run(String... args) {
        log.info("Starting Cosmos DB data migration check...");
        
        try (CosmosClient client = cosmosClientBuilder.buildClient()) {
            CosmosDatabase db = client.getDatabase(database);
            CosmosContainer container = db.getContainer("anuncios");

            // Query for documents with legacy status using raw SQL
            String query = "SELECT * FROM c WHERE c.status = 'PENDENTE_PAGAMENTO'";
            CosmosQueryRequestOptions options = new CosmosQueryRequestOptions();
            
            CosmosPagedIterable<JsonNode> results = container.queryItems(
                query, 
                options, 
                JsonNode.class
            );

            int migratedCount = 0;
            int errorCount = 0;

            for (JsonNode doc : results) {
                try {
                    String id = doc.get("id").asText();
                    String usuarioId = doc.get("usuarioId").asText();
                    
                    // Create updated document
                    ObjectNode updatedDoc = (ObjectNode) doc;
                    updatedDoc.put("status", "ATIVO");
                    
                    // Set expiration date if not present (60 days from creation)
                    if (!doc.has("expiraEm") || doc.get("expiraEm").isNull()) {
                        if (doc.has("criadoEm") && !doc.get("criadoEm").isNull()) {
                            // Just leave expiraEm as null - will be set on next update
                            // Or calculate it here if needed
                        }
                    }
                    
                    // Replace the document
                    container.replaceItem(
                        updatedDoc,
                        id,
                        new PartitionKey(usuarioId),
                        new CosmosItemRequestOptions()
                    );
                    
                    migratedCount++;
                    log.info("Migrated intention {} from PENDENTE_PAGAMENTO to ATIVO", id);
                    
                } catch (Exception e) {
                    errorCount++;
                    log.error("Failed to migrate document: {}", e.getMessage());
                }
            }

            if (migratedCount > 0 || errorCount > 0) {
                log.info("Migration complete: {} documents migrated, {} errors", migratedCount, errorCount);
            } else {
                log.info("No documents with PENDENTE_PAGAMENTO status found. Migration not needed.");
            }

        } catch (Exception e) {
            log.error("Migration failed: {}", e.getMessage(), e);
            // Don't throw - let the application start anyway
        }
    }
}
