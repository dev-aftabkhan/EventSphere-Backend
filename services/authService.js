const pool = require("../config/mysqlConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET; // Secret key for JWT

const registerUser = async (username, personalEmail, password) => {
    // Check if the email already exists
    const [existingUser] = await pool.query(
        "SELECT member_id FROM organization_member WHERE personal_email = ?",
        [personalEmail]
    );

    if (existingUser.length > 0) {
        return { success: false, message: "Email already in use. Please use a different email." };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date();


    // Execute the stored procedure
    const [rows] = await pool.query(
        "INSERT INTO organization_member (username, password_hash, personal_email, view_role, created_at) VALUES (?, ?, ?, ?, ?)",
        [username, hashedPassword, personalEmail, 'volunteer', createdAt]
    );

    // Extract the new member ID from the result
    const member_id = rows.insertId;

    return { success: true, message: "User registered successfully", member_id };
};

const loginUser = async (personalEmail, password) => {
    // Fetch user by email
    const [users] = await pool.query(
        "SELECT member_id, username, password_hash, personal_email, view_role FROM organization_member WHERE personal_email = ?",
        [personalEmail]
    );

    if (users.length === 0) {
        return { success: false, message: "Invalid credentials" }; // No user found
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return { success: false, message: "Invalid credentials" }; // Incorrect password
    }

    // Generate JWT token
    const token = jwt.sign(
        { member_id: user.member_id, personal_email: user.personal_email, view_role: user.view_role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );

    // Return user info without password hash
    return {
        success: true,
        message: "Login successful",
        token,
        user: {
            member_id: user.member_id,
            username: user.username,
            personal_email: user.personal_email,
            view_role: user.view_role
        }
    };
};
// ✅ Verify JWT Token and Fetch User Details
const autoLogin = async (token) => {
    try {
        // 🔹 Check if token is provided
        if (!token) {
            return { redirect: "register", message: "Token missing. Redirecting to register." };
        }

        // 🔹 Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return { redirect: "login", message: "Token expired. Redirecting to login." };
            }
            throw new Error("Invalid token.");
        }

        // 🔹 Fetch user details from database
        const query = `SELECT member_id, username, personal_email, view_role FROM organization_member WHERE member_id = ?`;
        const [user] = await pool.query(query, [decoded.member_id]);

        if (user.length === 0) {
            return { redirect: "register", message: "User not found. Redirecting to register." };
        }

        return { success: true, user: user[0] };

    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = { registerUser, loginUser, autoLogin };


 
