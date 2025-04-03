const { Kafka } = require("kafkajs");
require("dotenv").config();
const ConsoleLogs = require("../utils/consoleLogs");

const kafka = new Kafka({
    clientId: "backend-service",
    brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

const connectProducer = async () => {
    await producer.connect();
    ConsoleLogs.info("Kafka Producer connected");
};

module.exports = { producer, connectProducer };
