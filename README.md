# 🌐 Nexio-EventSphere — Backend

A **modular Node.js backend** for the **EventSphere** platform, combining **MySQL** (relational data), **MongoDB** (log storage), and **Kafka** (event streaming) for scalable, decoupled processing.
Designed to power EventSphere’s **web and mobile clients** with robust APIs, event logging, and efficient data pipelines.

---

## ⚡ Overview

This backend manages:

* **Express API server** with route-based services
* **MySQL-backed** schemas for users, events, and organizations
* **Kafka producers/consumers** for asynchronous logging
* **MongoDB consumers** for long-term log persistence

It supports **JWT authentication**, **file uploads**, **admin and leader modules**, and **real-time data ingestion** through Kafka.

---

## 🚀 Quickstart (Local Setup)

1. **Create `.env`** in the project root (see variables below).
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. *(Optional)* Start **Kafka** locally:

   ```bash
   docker-compose -f kafka/docker-compose.yml up -d
   ```
4. **Run the server:**

   ```bash
   npm start
   ```

> The server verifies MySQL connectivity before startup.
> Ensure MySQL (and MongoDB for consumers) is running.

---

## 🔑 Environment Variables

Create a `.env` file with:

```bash
MAINPORT=2025
JWT_SECRET=supersecret
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=example
MYSQL_DB=eventsphere
MONGO_URI=mongodb://localhost:27017/eventsphere
KAFKA_BROKER=localhost:9092
DISCORD_WEBHOOK_URL=
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost
```

| Variable                    | Purpose                            |
| --------------------------- | ---------------------------------- |
| `MAINPORT`                  | Server port (default 2025)         |
| `JWT_SECRET`                | JWT signing secret                 |
| `MYSQL_*`                   | MySQL connection credentials       |
| `MONGO_URI`                 | MongoDB connection for log storage |
| `KAFKA_BROKER`              | Kafka broker address               |
| `DISCORD_WEBHOOK_URL`       | Optional Discord webhook (tickets) |
| `CLIENT_URL` / `SERVER_URL` | Used for CORS and image URLs       |

---

## 🏗 Architecture & Data Flow

* **Server:** `server.js` (Express, CORS, helmet, compression)
* **Routes:** Organized under `routes/` (auth, admin, leader, user, image, fetch)
* **Controllers:** Handle business logic; **Services:** perform DB operations
* **MySQL:** Primary data storage (`config/mysqlConfig.js`)
* **Kafka:** Producers log activity → Consumers store batches in MongoDB
* **MongoDB:** Long-term storage for logs (`database/mongodb/`)

### Example Flows

* **Registration:** `/api/auth/register` → `authService.registerUser()` → MySQL procedure `CreateUser`
* **Image Upload:** `/api/image/upload` → multer → `imageService.saveImageDetails()` → file moved to `/uploads/`
* **Logging:** Kafka producer publishes JSON → Consumer batch inserts into MongoDB every 15 minutes

---

## 🔗 API Summary

**Base path:** `/api`

| Module     | Key Endpoints                                                                | Auth    |
| ---------- | ---------------------------------------------------------------------------- | ------- |
| **Auth**   | `POST /auth/register`, `POST /auth/login`, `GET /auth/auto-login`            | JWT     |
| **Image**  | `POST /image/upload` (multipart, fields: `eventId`, `uploadedBy`, `caption`) | API Key |
| **Admin**  | CRUD for users, events, announcements, roles (`/admin/*`)                    | API Key |
| **Leader** | Manage members, roles, requests (`/leader/*`)                                | API Key |
| **Fetch**  | Get events, organizations, announcements (`/fetch/*`)                        | API Key |
| **User**   | `POST /user/raiseTicket` (triggers Discord webhook)                          | JWT     |

> Responses are JSON and include `success: true|false` with proper HTTP codes.

---

## 🧩 Kafka & Consumers

* **Topics:** `FunctionCallLogs`, `LeaderActivityLogs`
* **Producers:** `producers/functionCallProducer.js`, `producers/leaderActivityProducer.js`
* **Consumers:** `consumers/functionCallLogConsumer.js`, `consumers/leaderActivityLogConsumer.js`

  * Buffer messages, then bulk insert into MongoDB every **15 minutes**
* **Local Kafka:** `kafka/docker-compose.yml`

  * Create topics via `kafka-topics` CLI if needed

---

## 🖼 Image Upload Flow

1. `middleware/uploadMiddleware.js` handles file storage via **multer**
2. `imageService.saveImageDetails()`:

   * Inserts record into MySQL
   * Renames file → `<imageId>.png`
   * Updates DB with public image URL (`SERVER_URL` + port)
3. Files served under `/uploads` path

---

## ⚙️ Operations & Scaling

* Scale consumers horizontally (more Kafka partitions + consumer instances)
* Monitor **consumer lag** and **MongoDB batch times**
* Periodically backup **MySQL** and rotate **MongoDB logs**
* Use **PM2** or containers for production runtime

---

## 🤝 Contributing

1. Branch from `main`
2. Implement and test changes locally
3. Submit a PR with description and validation steps

> Automated tests not yet included — test against seeded DB manually.

---

## 🗂 File Map (Short)

```
server.js                 → Entry point
config/                   → MySQL, Kafka configs
routes/, controllers/     → API & logic
services/                 → DB business logic
producers/, consumers/    → Kafka modules
database/mongodb/         → Mongoose models
middleware/               → Auth, upload, API key
utils/, webhooks/         → Helpers, Discord integration
```

---

## 🧾 License

Licensed under **GNU GPL v3** — see `LICENSE`.

