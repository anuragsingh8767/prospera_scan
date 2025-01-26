package springapi.controller;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import springapi.service.OSIndexingService;
import springapi.service.PIIDetectionService;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

@RestController
public class AwsOSController {

    private final OSIndexingService osIndexingService;
    private final PIIDetectionService piiDetectionService;

    public AwsOSController(OSIndexingService osIndexingService, PIIDetectionService piiDetectionService) {
        this.osIndexingService = osIndexingService;
        this.piiDetectionService = piiDetectionService;
    }

    @GetMapping("/process")
    public ApiResponse parseFile(@RequestParam String filepath) {
        try {
            File file = new File(filepath);
            InputStream inputStream = new FileInputStream(file);

            BodyContentHandler content = new BodyContentHandler(-1);
            Metadata metadata = new Metadata();
            AutoDetectParser parser = new AutoDetectParser();
            ParseContext context = new ParseContext();

            parser.parse(inputStream, content, metadata, context);
            inputStream.close();

            String fileContent = content.toString();
            String fileMetadata = metadata.toString();
            String filePath = file.getAbsolutePath();

            // Detect PII in the file content
            String piiEntities = piiDetectionService.detectPII(fileContent);
            System.out.println(piiEntities);

            // Index the document
            String index = "testmytika";
            osIndexingService.indexDocument(index, fileContent, fileMetadata, filePath, piiEntities);

            return new ApiResponse(fileContent, piiEntities);

        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error occurred: " + e.getMessage(), null);
        }
    }
}
