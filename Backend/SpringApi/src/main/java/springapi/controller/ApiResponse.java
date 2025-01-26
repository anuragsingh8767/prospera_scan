package springapi.controller;

public class ApiResponse {
    private String content;
    private String piiEntities;

    public ApiResponse() {
    }

    public ApiResponse(String content, String piiEntities) {
        this.content = content;
        this.piiEntities = piiEntities;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getpiiEntities() {
        return piiEntities;
    }

    public void setpiiEntities(String piiEntities) {
        this.piiEntities = piiEntities;
    }
}
