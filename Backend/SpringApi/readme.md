Dependencies:
- Java 21
- Maven (Optional, Not sure)
- Docker Desktop

1> Start the app: `./mvnw spring-boot:run`


2> Send Get request to the app-server either from browser or postman to get extracted text
URL: `http://localhost:8080/parse?filepath=path/to/your/file`

Send Get request to the app-server either from browser or postman to ingest extracted text into opensearch
URL: `http://localhost:8080/ingest?filepath=path/to/your/file`

Send Get request to the app-server either from browser or postman to ingest text processed using AWS Service into Opensearch
URL: `http://localhost:8080/process?filepath=path/to/your/file`

example usage: `http://localhost:8080/parse?filepath=E:/Training_Dataset/cv.pdf`


3> To Create Docker image of the app, run following command from Root directory: 
- Build the app: `./mvnw clean package`
- Build image: `docker build -t springapi .` 


4> Review docker/docker-compose.yml file:
- Mount Directories into volume under service springapi


5> Run Project with docker-compose:
- run opensearch in docker: `cd docker` & then run: `docker-compose up -d`

Send Get request to the app-server either from browser or postman to get extracted text
URL: `http://localhost:8080/parse?filepath=/file/path/inside/docker/volume`

Send Get request to the app-server either from browser or postman to ingest extracted text into opensearch
URL: `http://localhost:8080/ingest?filepath=/file/path/inside/docker/volume`

Send Get request to the app-server either from browser or postman to ingest text processed using AWS Service into Opensearch
URL: `http://localhost:8080/process?filepath=/file/path/inside/docker/volume`

Note: for mounted volume `E:/Training_Dataset:/Training_Dataset`,
example usage: `http://localhost:8080/parse?filepath=/Training_Dataset/cv.pdf`