import React from "react";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080/api/admin/users";
export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [editingUser, setEditingUser] = useState(null)
    const [form, setForm] = useState({
        username: "",
        gmail: "",
        password: "",
        role: "user"
    });

    const [message, setMessage] = useState("")

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(API_BASE)
                const data = await response.json()
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        }
        fetchUsers();
    }, [users])

    const resetForm = () => {
        setForm({
            username: "",
            gmail: "",
            password: "",
            role: "user"
        });
        setEditingUser(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleEditClick = (user) => {
        setEditingUser(user);
        setForm({
            username: user.username,
            gmail: user.gmail,
            password: "",
            role: user.role
        });
    }

    const handleDelete = async (userId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

        try {
            const response = await fetch(`${API_BASE}/${userId}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("Xóa người dùng thất bại");
            }
            setUsers(users.filter(user => user._id !== userId));
            setMessage("Người dùng đã được xóa thành công");
        } catch (error) {
            console.error("Failed to delete user:", error);
            setMessage("Xóa người dùng thất bại");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingUser ? "PUT" : "POST";
            const url = editingUser ? `${API_BASE}/${editingUser._id}` : API_BASE;

            const payload = { ...form };
            if (editingUser && !form.password) {
                delete payload.password;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(editingUser ? "Cập nhật người dùng thất bại" : "Tạo người dùng thất bại");
            }
            const data = await response.json();
            if (editingUser) {
                setUsers(users.map(user => user._id === editingUser._id ? data : user));
                setMessage("Người dùng đã được cập nhật thành công");
            } else {
                setUsers([...users, data]);
                setMessage("Người dùng đã được tạo thành công");
            }
            resetForm();
        } catch (error) {
            console.error("Failed to submit user:", error);
            setMessage(editingUser ? "Cập nhật người dùng thất bại" : "Tạo người dùng thất bại");
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Quản Lý Người Dùng</h2>

            {message && <div style={{ marginBottom: 10, color: "green" }}>{message}</div>}

            <h3>{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</h3>
            <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
                <div>
                    <label>Username: </label>
                    <input type="text" name="username" value={form.username} onChange={handleChange} required disabled={!!editingUser} />
                </div>

                <div>
                    <label>Gmail: </label>
                    <input type="email" name="gmail" value={form.gmail} onChange={handleChange} required />
                </div>

                <div>
                    <label>Password: {editingUser ? "(để trống nếu không đổi)" : ""} </label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder={editingUser ? "Để trống nếu không đổi" : ""} />
                </div>

                <div>
                    <label>Role: </label>
                    <select name="role" value={form.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button type="submit">{editingUser ? "Cập Nhật Người Dùng" : "Tạo Người Dùng"}</button>
                {editingUser && <button type="button" onClick={resetForm} style={{ marginLeft: 10 }}>Hủy</button>}

            </form>

            <h3>Danh Sách Người Dùng</h3>
            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Gmail</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.username}</td>
                            <td>{user.gmail}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleEditClick(user)}>Chỉnh Sửa</button>
                                <button onClick={() => handleDelete(user._id)} style={{ marginLeft: 10 }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="4">Không có người dùng nào.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}