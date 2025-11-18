import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
// POST /api/register
export const registerUser = async (req, res) => {
    try {
        const { username, password, gmail } = req.body;

        if (!username || !password || !gmail) {
            return res.status(400).json({ message: "Thiếu username / password / gmail" });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { gmail }],
        });

        if (existingUser) {
            return res.status(400).json({ message: "Username hoặc gmail đã tồn tại" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            password: hashedPassword,
            gmail,
            role: "user",
        });

        res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                username: user.username,
                gmail: user.gmail,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Lỗi registerUser:", error);
        res.status(500).json({ message: "Lỗi server khi đăng ký" });
    }
};

// POST /api/login
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Thiếu username hoặc password" });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Sai thông tin đăng nhập" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Sai thông tin đăng nhập" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Đăng nhập thành công",
            token,
            user: {
                username: user.username,
                gmail: user.gmail,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Lỗi loginUser:", error);
        res.status(500).json({ message: "Lỗi server khi đăng nhập" });
    }
};
