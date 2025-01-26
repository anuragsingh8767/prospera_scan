package springapi.service;

public class IndexData {
    private String fileContent;
    private String fileMetadata;
    private String filePath;
    private String piiEntities;

    // Constructor
    public IndexData(String fileContent, String fileMetadata, String filePath, String piiEntities) {
        this.fileContent = fileContent;
        this.fileMetadata = fileMetadata;
        this.filePath = filePath;
        this.piiEntities = piiEntities;
    }

    // Getters and setters
    public String getFileContent() {
        return fileContent;
    }

    public void setFileContent(String fileContent) {
        this.fileContent = fileContent;
    }

    public String getFileMetadata() {
        return fileMetadata;
    }

    public void setFileMetadata(String fileMetadata) {
        this.fileMetadata = fileMetadata;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getPiiEntity() {
        return piiEntities;
    }

    public void setPiientity(String piiEntities) {
        this.piiEntities = piiEntities;
    }
}
