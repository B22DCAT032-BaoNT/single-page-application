import React from "react";
export default function NoMatch() {
    return (
        <div className="page-container text-center">
            <div className="card">
                <h2 className="mb-16">404 - Trang không tìm thấy</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Rất tiếc, trang bạn đang tìm kiếm không tồn tại.</p>
            </div>
        </div>
    );
}