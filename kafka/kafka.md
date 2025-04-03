## Install Kafka (Start Kafka and Zookeeper using Docker Compose)
```bash
docker-compose up -d
```
## Check the running Kafka and Zookeeper containers
```bash
docker ps
```
## Restart Kafka and Zookeeper services
```bash
docker restart kafka-zookeeper-1 kafka-kafka-1
```

## Get into the running Kafka container
```bash
docker exec -it kafka-kafka-1 bash
```

## Create topics for function call logs and leader activity logs
```bash
kafka-topics --create --topic FunctionCallLogs --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1
kafka-topics --create --topic LeaderActivityLogs --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

## List all available Kafka topics
```bash
kafka-topics --list --bootstrap-server localhost:9092
```

## Check existing consumer groups
```bash
kafka-consumer-groups --bootstrap-server localhost:9092 --list
```

## Delete a Kafka topic if needed
```bash
kafka-topics --delete --topic FunctionCallLogs --bootstrap-server localhost:9092
kafka-topics --delete --topic LeaderActivityLogs --bootstrap-server localhost:9092
```

## Run Mailpit (for email notifications, if applicable)
```bash
docker run --rm -p 1025:1025 -p 8025:8025 axllent/mailpit
```
