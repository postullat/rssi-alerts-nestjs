# rssi-alerts-nestjs

### Requirements
1. Docker v27.*
2. Node 20.*
3. npm 10.8.*

### How to run on local machine
1. Run docker engine
2. from project root `docker-compose up --build`

### Urls
1. Kafka UI - `http://localhost:8080/`
2. Swagger - `http://localhost:4000/api-docs`
3. device-api - `http://localhost:4000`
4. rssi-monitor - `http://localhost:4001`
5. IMPORTANT: device-api and rssi-monitor might require a restart since they fail once can't connect to the kafka after a few tries. This can be fixed, but I need more time

### Tests

`npm run test -- src/rssi/rssi.service.spec.ts`