package springapi.controller;

import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Hidden;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

@RestController
public class TikaparserController {

    @Hidden
    @GetMapping("/parse")
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

            // Create and return the response
            ApiResponse response = new ApiResponse();
            response.setContent(content.toString());
            response.setpiiEntities(metadata.toString());

            return response;

        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error occurred: " + e.getMessage(), null);
        }
    }
}
