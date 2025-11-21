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


    if (loading) return <div className="loading-container">Đang tải...</div>;
    if (error || !post) return <div className="error-container">Lỗi: {error}</div>;

    return (
        <div className="page-container page-container--narrow">
            <div className="post-card">
                <div className="post-card__header">
                    <h1 className="post-card__title">{post.title}</h1>
                    <div className="post-card__meta">
                        <span><strong>Tác giả:</strong> {post.author || "Ẩn danh"}</span>
                        <span style={{ marginLeft: 10 }}>| <strong>Ngày đăng:</strong> {new Date(post.createdAt).toLocaleString()}</span>
                        {post.updatedAt !== post.createdAt && (
                            <span style={{ marginLeft: 10 }}>| <strong>Đã sửa:</strong> {new Date(post.updatedAt).toLocaleString()}</span>
                        )}
                    </div>
                </div>

                <div className="post-card__content">
                    <p className="post-card__description">
                        {post.description}
                    </p>
                </div>
            </div>

            <div className="comment-section">
                <h3 className="mb-16">Bình luận ({post.comments?.length || 0})</h3>

                {user ? (
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Viết bình luận của bạn..."
                            rows={3}
                        />
                        <button type="submit" className="mt-16">Gửi</button>
                    </form>
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }}><em>Vui lòng đăng nhập để bình luận.</em></p>
                )}

                <ul className="comment-list">
                    {post.comments?.map((c) => (
                        <li key={c.id} className="comment-item">
                            <p className="comment-item__text">{c.text}</p>
                            <small className="comment-item__meta">{new Date(c.timestamp).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}