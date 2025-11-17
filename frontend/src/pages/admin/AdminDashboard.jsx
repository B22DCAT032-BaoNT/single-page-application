import React from 'react';
import { Link, Outlet } from 'react-router-dom';
export default function AdminDashboard() {
    return (
        <div style={{ padding: 20 }}>
            <h2>Trang Quản Trị (Admin Panel)</h2>
            <p>Chỉ có tài khoản với vai trò "admin" mới thấy được trang này.</p>
            <ul>
                <li>
                    <Link to="users">Quản Lý Người Dùng</Link>

                </li>
            </ul>
            <Outlet />
        </div>
    );
}