import React, { useState, useEffect } from "react";

export default function PostCount() {

    const [postCount, setPostCount] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCount = async () => {
            try {

                const response = await fetch("http://localhost:8080/api/posts");
                const data = await response.json();

                setPostCount(data.length);
            } catch (error) {
                console.error("Lỗi khi đếm bài viết:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCount();
    }, []);

    if (loading) {
        return <p>Đang đếm bài viết...</p>;
    }

    return (
        <div>
            <p>Tổng số bài viết: {postCount}</p>
        </div>
    );
}
