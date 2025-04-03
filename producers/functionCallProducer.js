const { producer } = require("../config/kafkaConfig");

const sendFunctionCallLog = async (logData) => {
    try {
        await producer.send({
            topic: "FunctionCallLogs",
            messages: [{ value: JSON.stringify(logData) }],
        });
        console.log("Function Call Log sent to Kafka:", logData);
    } catch (error) {
        console.error("Error sending Function Call Log to Kafka:", error);
    }
};

module.exports = sendFunctionCallLog;
