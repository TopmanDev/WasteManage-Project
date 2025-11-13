const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ JWT Helper
const generateToken = (admin) => {
    return jwt.sign(
        {
            id: admin._id,
            email: admin.email,
            role: admin.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// ✅ Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = generateToken(admin);

        res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Reset Password inside Admin App — No Email Required
exports.resetPasswordInsideApp = async (req, res) => {
    try {
        const adminId = req.admin.id; // From authMiddleware
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

