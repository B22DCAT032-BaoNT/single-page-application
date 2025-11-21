import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function PostLists({ user }) {
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
    }, [debouncedSearchTerm, data.length]);

    const handleDelete = async (slug) => {
        if (!globalThis.confirm("Bạn chắc chắn muốn xóa bài này?")) return;
        const token = localStorage.getItem("accessToken");
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${slug}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                setData(prevData => prevData.filter(post => post.slug !== slug));
                alert("Xóa bài thành công!");
            }

        } catch (error) { console.error(error); }
    };

    if (loading) {
        return <div className="loading-container">Đang tải bài viết...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="page-container">
            <div className="search-box mb-24">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {data.map((d) => (
                <div key={d.slug} className="post-card">
                    <div className="post-card__header">
                        <Link to={`/posts/${d.slug}`}>
                            <h3 className="post-card__title">{d.title}</h3>
                        </Link>
                        <div className="post-card__meta">
                            Tác giả: {d.author}
                        </div>
                    </div>
                    {user && (user.role === "admin" || user.username === d.author) && (
                        <div className="post-card__footer">
                            <button onClick={() => handleDelete(d.slug)} className="btn-danger">Xóa</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}