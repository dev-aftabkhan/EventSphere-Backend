const authService = require("../services/authService");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const response = await authService.registerUser(username, email, password, "volunteer");

        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const response = await authService.loginUser(email, password);

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: error.message });
    }
};

const autoLogin = async (req, res) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Extract token
        const result = await authService.autoLogin(token);

        if (result.redirect) {
            return res.status(401).json(result);
        }

        res.status(200).json({ message: "Auto-login successful", user: result.user });

    } catch (error) {
        res.status(500).json({ error: "Auto-login failed", details: error.message });
    }
};

module.exports = { register, login, autoLogin };
