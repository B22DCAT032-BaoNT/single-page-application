import React, { useState, useEffect } from "react";

export default function PostCount() {

    const [postCount, setPostCount] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/posts');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
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
        return <p>Đang đếm bài viết...</p>;
    }

    return (
        <div>
            <p>Tổng số bài viết: {postCount}</p>
        </div>
    );
}
