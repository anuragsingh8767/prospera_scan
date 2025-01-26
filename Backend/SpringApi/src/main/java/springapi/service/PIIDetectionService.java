package springapi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.comprehend.ComprehendClient;
import software.amazon.awssdk.services.comprehend.model.DetectPiiEntitiesRequest;
import software.amazon.awssdk.services.comprehend.model.DetectPiiEntitiesResponse;
import software.amazon.awssdk.services.comprehend.model.LanguageCode;

import java.util.ArrayList;
import java.util.List;

@Service
public class PIIDetectionService {

    @Value("${aws.accesskey}")
    private String awsaccesskey;
    @Value("${aws.secretkey}")
    private String awssecretkey;

    public String detectPII(String text) throws JsonProcessingException {
        
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(awsaccesskey, awssecretkey);

        // Create a Comprehend client
        ComprehendClient comprehendClient = ComprehendClient.builder()
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .region(Region.AP_SOUTH_1) // Change the region as per your requirement
                .build();

        // Create the request
        DetectPiiEntitiesRequest piiRequest = DetectPiiEntitiesRequest.builder()
                .text(text)
                .languageCode(LanguageCode.EN)
                .build();

        // Detect PII entities
        DetectPiiEntitiesResponse piiResponse = comprehendClient.detectPiiEntities(piiRequest);

        // Extract and process the detected PII entities
        List<PiiEntity> piiEntities = new ArrayList<>();
        for (software.amazon.awssdk.services.comprehend.model.PiiEntity entity : piiResponse.entities()) {
            String entityValue = text.substring(entity.beginOffset(), entity.endOffset());
            PiiEntity piiEntity = new PiiEntity(entity.typeAsString(), entityValue, entity.beginOffset(), entity.endOffset());
            piiEntities.add(piiEntity);
        }

        // Convert the list of PII entities to JSON
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResult = objectMapper.writeValueAsString(piiEntities);

        // Close the Comprehend client
        comprehendClient.close();

        return jsonResult;
    }

    // Custom class to represent a PII Entity
    static class PiiEntity {
        private String type;
        private String value;
        private int beginOffset;
        private int endOffset;

        public PiiEntity(String type, String value, int beginOffset, int endOffset) {
            this.type = type;
            this.value = value;
            this.beginOffset = beginOffset;
            this.endOffset = endOffset;
        }

        // Getters and setters
        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public int getBeginOffset() {
            return beginOffset;
        }

        public void setBeginOffset(int beginOffset) {
            this.beginOffset = beginOffset;
        }

        public int getEndOffset() {
            return endOffset;
        }

        public void setEndOffset(int endOffset) {
            this.endOffset = endOffset;
        }
    }
}

