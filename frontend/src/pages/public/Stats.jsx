import React, { useState, useEffect } from "react";

export default function Stats() {

    const [postCount, setPostCount] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/posts');
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP: ${response.status}`);
                }
                const result = await response.json();
                setPostCount(result.length);
            } catch (error) {
                console.error("Lỗi khi fetch data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div className="loading-container">Đang đếm bài viết...</div>;
    }

    return (
        <div className="page-container">
            <div className="card text-center">
                <h2 className="mb-16">Thống Kê</h2>
                <p style={{ fontSize: '18px' }}>Tổng số bài viết: <strong>{postCount}</strong></p>
            </div>
        </div>
    );
}
