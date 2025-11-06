# Kafka Guide

This project uses Kafka to stream logs (function call logs and leader activity logs) and decouple log generation from storage.

Included artifacts:
- `kafka/docker-compose.yml` — a Docker Compose file (Zookeeper + Kafka) for local testing.
- `kafka/kafka.md` — commands and guidance for topic creation and container management.
- `config/kafkaConfig.js` — Kafka client and producer used by the app.
- `producers/functionCallProducer.js` and `producers/leaderActivityProducer.js` — publish messages to `FunctionCallLogs` and `LeaderActivityLogs` topics.
- `consumers/*` — consumer processes that subscribe to the topics and batch-insert into MongoDB every 15 minutes.

Topics used:
- `FunctionCallLogs` — high volume logs for backend function calls
- `LeaderActivityLogs` — leader-specific activities

How to run locally (quick):

1. Start Docker Compose in the `kafka/` folder

```powershell
docker-compose -f kafka/docker-compose.yml up -d
```

2. Create topics inside the Kafka environment (example commands):

```powershell
kafka-topics --create --topic FunctionCallLogs --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics --create --topic LeaderActivityLogs --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

3. Ensure `KAFKA_BROKER` in `.env` points to `localhost:9092` (or to the correct host:port).

Operational notes:
- Consumers buffer messages and perform batched inserts every 15 minutes to reduce DB overhead.
- Scale consumers horizontally by running more consumer process instances with the same consumer group ID.
