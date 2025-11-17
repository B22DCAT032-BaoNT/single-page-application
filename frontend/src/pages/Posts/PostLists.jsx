import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function PostLists() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 1000);
        return () => clearTimeout(timeId);
    }, [searchTerm]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = `http://localhost:8080/api/posts?search=${encodeURIComponent(debouncedSearchTerm)}`;
                const response = await fetch(url);

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
    }, [debouncedSearchTerm]);

    if (loading) {
        return <div>Đang tải bài viết...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Tìm Kiếm</h2>
            <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />
            <ul>
                {data.map((d) => (
                    <li key={d.slug}>
                        <Link to={`/posts/${d.slug}`}>
                            <h3>{d.title}</h3>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}