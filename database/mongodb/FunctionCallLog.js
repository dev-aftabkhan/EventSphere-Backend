const mongoose = require("mongoose");

const FunctionCallLogSchema = new mongoose.Schema({
    LogID: { type: String, required: true, unique: true },
    endpoint: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    parameters: { type: Object }, // Stores API request parameters
    function_name: { type: String, required: true },
    http_method_type: { type: String, required: true, enum: ["GET", "POST", "PUT", "DELETE"] },
    header: { type: Object }, // Stores headers like Authorization, Content-Type, etc.
    log_message: { type: String, required: true },
    log_type: { type: String, enum: ["info", "error", "warning", "success"], required: true },
});

module.exports = mongoose.model("FunctionCallLog", FunctionCallLogSchema);
