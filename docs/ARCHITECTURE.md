# Architecture

High level components:

- Express API server (`server.js`) — handles HTTP requests, authenticates users, and exposes REST endpoints.
- MySQL — primary relational store for application data (users, events, roles, announcements, images metadata, help requests).
- MongoDB — stores high-volume log documents produced by Kafka consumers (FunctionCallLog, LeaderActivityLog).
- Kafka — message bus used for decoupling logs and asynchronous workflows. Producers publish to topics and consumers batch-insert to MongoDB.

Flow examples:
- User registers via `/api/auth/register` -> `authController` -> `authService` inserts user into MySQL
- Image upload: `/api/image/upload` -> `uploadMiddleware` stores file temporarily -> `imageService.saveImageDetails` inserts metadata + renames file -> updates DB with public URL
- Logging: important operations call producers in `producers/` to send JSON messages to Kafka; consumers buffer messages and periodically write to MongoDB collections under `database/mongodb/`.

Key files:
- `config/kafkaConfig.js` — Kafka producer setup
- `producers/*.js` — send messages to Kafka topics
- `consumers/*.js` — read topics and insert into MongoDB
- `database/mongodb/*.js` — Mongoose schemas for persisted logs
