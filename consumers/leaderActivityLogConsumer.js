const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const LeaderActivityLog = require("../database/mongodb/LeaderActivityLog");
const mongoConfig = require("../config/mongoConfig");
require("dotenv").config("../.env");

const kafka = new Kafka({ clientId: "log-consumer", brokers: process.env.KAFKA_BROKER });
const consumer = kafka.consumer({ groupId: "LeaderLogConsumerGr" });

const buffer = [];
const BATCH_INTERVAL = 15 * 60 * 1000; // 15 minutes

const startConsumer = async () => {
    await mongoose.connect(mongoConfig.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    await consumer.connect();
    await consumer.subscribe({ topic: "LeaderActivityLogs", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const logData = JSON.parse(message.value.toString());
                buffer.push(logData);
            } catch (err) {
                console.error("Error parsing message:", err);
            }
        },
    });

    setInterval(async () => {
        if (buffer.length === 0) return;

        try {
            await LeaderActivityLog.insertMany(buffer);
            console.log(`Inserted ${buffer.length} Leader Activity Logs into MongoDB`);
            buffer.length = 0; // Clear buffer after insert
        } catch (err) {
            console.error("MongoDB Insert Error:", err);
        }
    }, BATCH_INTERVAL);
};

startConsumer().catch(console.error);
