import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Post() {
    const { slug } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8080/api/post/${slug}`);

                if (response.status === 404) {
                    throw new Error("Bài viết không tìm thấy");
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                setPost(result);
            } catch (error) {
                console.error("Lỗi khi fetch data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return <div>Đang tải bài viết...</div>;
    }

    if (error) {
        return <div style={{ padding: 20 }}><h2>Lỗi: {error}</h2></div>;
    }

    if (!post) {
        return <div style={{ padding: 20 }}>Không tìm thấy bài viết.</div>;
    }

    return (
        <div style={{ padding: 20 }}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
        </div>
    );
}