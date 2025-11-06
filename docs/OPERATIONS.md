# Operations & Notes

Consumers:
- `consumers/functionCallLogConsumer.js` and `consumers/leaderActivityLogConsumer.js` connect to Kafka, buffer messages, and every 15 minutes insert the buffered messages into MongoDB collections.
- Start consumers independently if you want log ingestion without starting the main server: `node consumers/functionCallLogConsumer.js`.

Scaling:
- Increase Kafka partitions and run multiple consumer instances with the same consumer group to scale consumers horizontally.
- If insert batches grow >50K per run, add more consumers and partitions.

Monitoring:
- Watch MongoDB insert latency and Kafka lag to detect backpressure.

Backups & Persistence:
- MySQL should be backed up using standard tools (mysqldump / managed DB snapshots).
- MongoDB collections holding logs can be rotated/archived if they grow large; consumers can be modified to write to time-partitioned collections.
