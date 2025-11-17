import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        console.error("Lỗi getAllUsers:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách người dùng" });
    }
}

export const createUserByAdmin = async (req, res) => {
    try {
        const { username, password, gmail, role = 'user' } = req.body;
        if (!username || !password || !gmail) {
            return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc" });
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
            role,
        });

        const safeUser = {
            _id: user._id,
            username: user.username,
            gmail: user.gmail,
            role: user.role,
        }
        res.status(201).json({
            message: "Người dùng đã được tạo thành công",
            user: safeUser,
        });
    } catch (error) {
        console.error("Lỗi createUserByAdmin:", error);
        res.status(500).json({ message: "Lỗi server khi tạo người dùng" });
    }
}

export const updateuserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, gmail, role } = req.body;

        const update = {};
        if (gmail) update.gmail = gmail;
        if (role) update.role = role;
        if (password) {
            update.password = await bcrypt.hash(password, 10);
        }

        const updated = await User.findByIdAndUpdate(id, update,
            {
                new: true,
                fields: '-password'
            });
        if (!updated) {
            return res.status(404).json({ message: "Người dùng không tìm thấy" });
        }

        res.json(updated);
    } catch (error) {
        console.error("Lỗi updateuserByAdmin:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật người dùng" });
    }
}

export const deleteUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Người dùng không tìm thấy" });
        }
        res.json({ message: "Người dùng đã được xóa thành công" });
    } catch (error) {
        console.error("Lỗi deleteUserByAdmin:", error);
        res.status(500).json({ message: "Lỗi server khi xóa người dùng" });
    }
}