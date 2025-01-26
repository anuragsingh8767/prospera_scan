package springapi.controller;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import springapi.service.OSIndexingService;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

@RestController
public class OpensearchController {

    @Autowired
    private OSIndexingService osIndexingService;

    @GetMapping("/ingest")
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
            String piiEntities = "Document is ingested without Entity Extraction";

            // Index the document
            String index = "testmyapi";
            osIndexingService.indexDocument(index, fileContent, fileMetadata, filePath, piiEntities);

            return new ApiResponse(fileContent, piiEntities);

        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error occurred: " + e.getMessage(), null);
        }
    }
}
