import React from 'react';
import { Link, Outlet } from 'react-router-dom';
export default function AdminDashboard() {
    return (
        <div className="page-container">
            <div className="card">
                <h2 className="mb-16">Trang Quản Trị (Admin Panel)</h2>
                <p className="mb-16" style={{ color: 'var(--text-secondary)' }}>Chỉ có tài khoản với vai trò "admin" mới thấy được trang này.</p>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>
                        <Link to="users" style={{ fontSize: '16px', fontWeight: 600 }}>Quản Lý Người Dùng</Link>
                    </li>
                </ul>
            </div>
            <Outlet />
        </div>
    );
}




