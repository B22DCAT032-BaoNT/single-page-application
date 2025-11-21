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
                const token = localStorage.getItem("accessToken");
                const response = await fetch(API_BASE, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await response.json()
                setUsers(data);
            } catch (error) {
                console.error("Lấy danh sách người dùng thất bại", error);
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
        if (!globalThis.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

        try {
            const response = await fetch(`${API_BASE}/${userId}`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                }
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
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
            console.error("Thất bại khi gửi dữ liệu người dùng:", error);
            setMessage(editingUser ? "Cập nhật người dùng thất bại" : "Tạo người dùng thất bại");
        }
    }

    return (
        <div className="page-container">
            <div className="card">
                <h2 className="mb-24">Quản Lý Người Dùng</h2>

                {message && <div className="mb-16" style={{ padding: '12px', backgroundColor: 'var(--accent-success)', borderRadius: '8px', color: 'white' }}>{message}</div>}

                <h3 className="mb-16">{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</h3>
                <form onSubmit={handleSubmit} className="mb-24">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input id="username" type="text" name="username" className="form-input" value={form.username} onChange={handleChange} required disabled={!!editingUser} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gmail" className="form-label">Gmail</label>
                        <input id="gmail" type="email" name="gmail" className="form-input" value={form.gmail} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password {editingUser ? "(để trống nếu không đổi)" : ""}</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="form-input"
                            value={form.password}
                            onChange={handleChange}
                            placeholder={editingUser ? "Để trống nếu không đổi" : ""} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role" className="form-label">Role</label>
                        <select id="role" name="role" className="form-input" value={form.role} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="action-buttons">
                        <button type="submit">{editingUser ? "Cập Nhật Người Dùng" : "Tạo Người Dùng"}</button>
                        {editingUser && <button type="button" onClick={resetForm} className="btn-secondary">Hủy</button>}
                    </div>
                </form>

                <h3 className="mb-16">Danh Sách Người Dùng</h3>
                <div className="admin-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Gmail</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.gmail}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => handleEditClick(user)} className="btn-secondary">Chỉnh Sửa</button>
                                            <button onClick={() => handleDelete(user._id)} className="btn-danger">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Không có người dùng nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}