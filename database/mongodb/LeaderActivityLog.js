const mongoose = require("mongoose");

const LeaderActivityLogSchema = new mongoose.Schema({
    leader_activity: { type: String, required: true }, // Activity type
    default_data: { type: Object },
    before_update_data: { type: Object },
    after_change_data: { type: Object },
    log_timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LeaderActivityLog", LeaderActivityLogSchema);
