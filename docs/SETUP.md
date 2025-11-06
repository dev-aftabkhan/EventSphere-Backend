# Setup & Quickstart

This section describes how to get the backend running locally for development.

Prerequisites:
- Node.js (14+ recommended)
- MySQL server
- MongoDB server
- (Optional) Docker & Docker Compose for Kafka

Steps:

1) Install dependencies

```powershell
npm install
```

2) Create `.env` file (see `docs/ENV.md`)

3) Start MySQL and create the expected schema (the code expects tables such as `organization_member`, `event`, `event_images`, `announcement`, `help_request`, etc.). This project assumes the database already has stored procedures like `CreateUser`.

4) Start MongoDB (for log storage)

5) (Optional) Start Kafka via Docker Compose (see `docs/KAFKA.md`):

```powershell
docker-compose -f kafka/docker-compose.yml up -d
```

6) Start the server

```powershell
npm start
```

If the server fails on startup, check logs: it validates MySQL connection before listening (see `server.js`).

Development notes:
- To test image upload flow, use the `/api/image/upload` endpoint (requires API key header and `multipart/form-data`). Uploaded files are temporarily stored in `uploads/` and then renamed and persisted by the `imageService`.
- Producers use `config/kafkaConfig.js`. Consumers are separate processes inside `consumers/` and can be started individually (e.g. `node consumers/functionCallLogConsumer.js`).
