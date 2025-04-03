const pool = require("../config/mysqlConfig");

const apiKeyMiddleware = (requiredAccessLevel) => {
    return async (req, res, next) => {
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({ error: "API key is required" });
        }

        try {
            // Query the database for the API key
            const [rows] = await pool.query(
                "SELECT access_level FROM api_keys WHERE api_key = ?",
                [apiKey]
            );

            if (rows.length === 0) {
                return res.status(403).json({ error: "Invalid API key" });
            }

            const userAccessLevel = rows[0].access_level;

            // Check if the user has the required access level
            if (userAccessLevel > requiredAccessLevel) {
                return res.status(403).json({ error: "Access denied" });
            }

            // Attach the access level to the request object
            req.accessLevel = userAccessLevel;

            next();
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };
};

module.exports = apiKeyMiddleware;
