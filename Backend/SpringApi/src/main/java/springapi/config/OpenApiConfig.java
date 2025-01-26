package springapi.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
    info = @Info(
        title = "Prosperascan",
        version = "v1"
    ),
    servers = @Server(
        description = "Dev",
        url = "http://localhost:8080"
    )
)

public class OpenApiConfig {

}
