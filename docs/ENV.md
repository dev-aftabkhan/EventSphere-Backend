# Environment variables

Create a `.env` file at the repository root. The server and modules expect the following variables (examples provided):

- `MAINPORT` or `PORT` — Port where the Express server listens (default 2025)
- `JWT_SECRET` — Secret string used to sign JWT tokens
- `MYSQL_HOST` — MySQL host (e.g. `127.0.0.1`)
- `MYSQL_USER` — MySQL username
- `MYSQL_PASSWORD` — MySQL password
- `MYSQL_DB` — MySQL database name
- `MONGO_URI` — MongoDB connection URI (e.g. `mongodb://user:pass@host:port/db`)
- `KAFKA_BROKER` — Kafka broker address (e.g. `localhost:9092`)
- `DISCORD_WEBHOOK_URL` — (optional) webhook URL for ticket notifications
- `CLIENT_URL` — (optional) used for CORS allowed origin; default `*` if not set
- `SERVER_URL` — public server host used to build image URLs (e.g. `http://localhost`)

Notes:
- `config/mysqlConfig.js` reads `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DB`.
- `config/mongoConfig.js` uses `MONGO_URI`.
- `config/kafkaConfig.js` expects `KAFKA_BROKER`.
- `webhooks/discordWebhook.js` requires `DISCORD_WEBHOOK_URL` to be set if Discord notifications are desired.

Example `.env`:

```
MAINPORT=2025
JWT_SECRET=supersecret
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=example
MYSQL_DB=eventsphere
MONGO_URI=mongodb://localhost:27017/eventsphere
KAFKA_BROKER=localhost:9092
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost
```
