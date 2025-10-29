import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function PostLists() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/posts");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Lỗi khi fetch data:", error);
                setError("Không thể tải danh sách bài viết.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Đang tải bài viết...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <ul>
            {data.map((d) => (
                <li key={d.slug}>
                    <Link to={`/posts/${d.slug}`}>
                        <h3>{d.title}</h3>
                    </Link>
                </li>
            ))}
        </ul>
    );
}