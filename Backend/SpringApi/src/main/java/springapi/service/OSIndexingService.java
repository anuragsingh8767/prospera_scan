package springapi.service;

import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLEngine;

import org.apache.hc.client5.http.auth.AuthScope;
import org.apache.hc.client5.http.auth.UsernamePasswordCredentials;
import org.apache.hc.client5.http.impl.auth.BasicCredentialsProvider;
import org.apache.hc.client5.http.impl.nio.PoolingAsyncClientConnectionManager;
import org.apache.hc.client5.http.impl.nio.PoolingAsyncClientConnectionManagerBuilder;
import org.apache.hc.client5.http.ssl.ClientTlsStrategyBuilder;

import org.apache.hc.core5.function.Factory;
import org.apache.hc.core5.http.HttpHost;
import org.apache.hc.core5.http.nio.ssl.TlsStrategy;
import org.apache.hc.core5.reactor.ssl.TlsDetails;
import org.apache.hc.core5.ssl.SSLContextBuilder;

import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch.core.IndexRequest;
import org.opensearch.client.opensearch.indices.CreateIndexRequest;
import org.opensearch.client.transport.endpoints.BooleanResponse;
import org.opensearch.client.transport.httpclient5.ApacheHttpClient5TransportBuilder;
import org.opensearch.client.opensearch.indices.ExistsRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class OSIndexingService {

    @Value("${mode}")
    private String osmode;
    @Value("${host}")
    private String oshost;
    @Value("${port}")
    private Integer osport;
    @Value("${user}")
    private String osuser;
    @Value("${pass}")
    private String ospass;

    private OpenSearchClient client;

    public void initializeClient() throws Exception {
        // System.setProperty("javax.net.ssl.trustStore", "/himay/myTrustStore.jks");
        // System.setProperty("javax.net.ssl.trustStorePassword", "mypassword");

        final HttpHost host = new HttpHost(osmode, oshost, osport);
        final BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(new AuthScope(host),
                new UsernamePasswordCredentials(osuser, ospass.toCharArray()));

        final SSLContext sslcontext = SSLContextBuilder
                .create()
                .loadTrustMaterial(null, (chains, authType) -> true)
                .build();

        final ApacheHttpClient5TransportBuilder builder = ApacheHttpClient5TransportBuilder.builder(host);
        builder.setHttpClientConfigCallback(httpClientBuilder -> {
            @SuppressWarnings("deprecation")
            final TlsStrategy tlsStrategy = ClientTlsStrategyBuilder.create()
                    .setSslContext(sslcontext)
                    .setTlsDetailsFactory(new Factory<SSLEngine, TlsDetails>() {
                        @Override
                        public TlsDetails create(final SSLEngine sslEngine) {
                            return new TlsDetails(sslEngine.getSession(), sslEngine.getApplicationProtocol());
                        }
                    })
                    .build();

            final PoolingAsyncClientConnectionManager connectionManager = PoolingAsyncClientConnectionManagerBuilder
                    .create()
                    .setTlsStrategy(tlsStrategy)
                    .build();

            return httpClientBuilder
                    .setDefaultCredentialsProvider(credentialsProvider)
                    .setConnectionManager(connectionManager);
        });

        // Initialize the OpenSearchClient
        this.client = new OpenSearchClient(builder.build());
    }

    public void indexDocument(String index, String fileContent, String fileMetadata, String filePath,
            String piiEntities) throws Exception {
        if (this.client == null) {
            initializeClient();
        }
        // Check if the index exists
        ExistsRequest existsRequest = new ExistsRequest.Builder().index(index).build();
        BooleanResponse existsResponse = client.indices().exists(existsRequest);

        if (!existsResponse.value()) {
            CreateIndexRequest createIndexRequest = new CreateIndexRequest.Builder().index(index).build();
            client.indices().create(createIndexRequest);
            System.out.println("index created");
        } else {
            System.out.println("index already exists");
        }

        // Prepare the document
        IndexData indexData = new IndexData(fileContent, fileMetadata, filePath, piiEntities);
        IndexRequest<IndexData> indexRequest = new IndexRequest.Builder<IndexData>()
                .index(index)
                .document(indexData)
                .build();
        client.index(indexRequest);
    }
}
