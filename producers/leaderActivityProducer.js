const { producer } = require("../config/kafkaConfig");

const sendLeaderActivityLog = async (logData) => {
    try {
        await producer.send({
            topic: "LeaderActivityLogs",
            messages: [{ value: JSON.stringify(logData) }],
        });
        console.log("Leader Activity Log sent to Kafka:", logData);
    } catch (error) {
        console.error("Error sending Leader Activity Log to Kafka:", error);
    }
};

module.exports = sendLeaderActivityLog;
