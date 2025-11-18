import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Post({ user }) {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        if (!slug) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/posts/${slug}`);
                if (!response.ok) throw new Error("Không thể tải bài viết");
                const result = await response.json();
                setPost(result);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`http://localhost:8080/api/posts/${slug}/comments`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: newComment })
            });

            if (response.ok) {
                const newCommentData = await response.json();
                setPost(prev => ({ ...prev, comments: [...prev.comments, newCommentData] }));
                setNewComment("");
            }
        } catch (error) {
            console.error("Lỗi comment:", error);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error || !post) return <div>Lỗi: {error}</div>;

    return (
        <div style={{ padding: 20, maxWidth: '800px', margin: '0 auto' }}>
            <h1 >{post.title}</h1>

            <div style={{ fontSize: '0.9rem', marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
                <span><strong>Tác giả:</strong> {post.author || "Ẩn danh"}</span>
                <span style={{ marginLeft: 10 }}>| <strong>Ngày đăng:</strong> {new Date(post.createdAt).toLocaleString()}</span>
                {post.updatedAt !== post.createdAt && (
                    <span style={{ marginLeft: 10 }}>| <strong>Đã sửa:</strong> {new Date(post.updatedAt).toLocaleString()}</span>
                )}
            </div>

            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: '1.1rem' }}>
                {post.description}
            </p>

            <hr style={{ margin: '30px 0' }} />

            <h3>Bình luận ({post.comments?.length || 0})</h3>

            {user ? (
                <form onSubmit={handleCommentSubmit} style={{ marginBottom: 20 }}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận của bạn..."
                        rows={3}
                        style={{ width: '100%', padding: 10 }}
                    />
                    <button type="submit" style={{ marginTop: 5, padding: '5px 15px' }}>Gửi</button>
                </form>
            ) : (
                <p><em>Vui lòng đăng nhập để bình luận.</em></p>
            )}

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {post.comments?.map((c) => (
                    <li key={c.id} style={{ padding: 10, marginBottom: 10, borderRadius: 5 }}>
                        <p style={{ margin: '0 0 5px 0' }}>{c.text}</p>
                        <small>{new Date(c.timestamp).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}