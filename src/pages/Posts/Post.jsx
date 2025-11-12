import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Post({ user }) {
    const { slug } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newComment, setNewComment] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: "", description: "" });
    const navigate = useNavigate();
    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8080/api/post/${slug}`);

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

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/post/${slug}/comments`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newComment })
            });
            if (!response.ok) {
                throw new Error(`Không thể thêm bình luận`);
            }

            const newCommentData = await response.json();
            setPost(prevPost => ({
                ...prevPost,
                comments: [...prevPost.comments, newCommentData]
            }));
            setNewComment("");
        } catch (error) {
            console.error("Lỗi khi thêm bình luận:", error);
        }
    };

    const handleRemovePost = async () => {
        try {
            await fetch(`http://localhost:8080/api/post/${slug}`, {
                method: "DELETE"
            });
            navigate("/posts");
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/post/${slug}`, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editData)
            });
            if (!response.ok) {
                throw new Error(`Không thể cập nhật bài viết`);
            }

            const newEditData = await response.json()

            setPost(prevPost => ({
                ...prevPost,
                title: newEditData.title,
                description: newEditData.description
            }));
            setIsEditing(false);
        }
        catch (error) {
            console.error("Lỗi khi cập nhật bài viết:", error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditData({
            title: post.title,
            description: post.description
        });
    };

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

            {user && <button type="button" onClick={handleRemovePost}>Xóa Bài Viết</button>}
            {user && !isEditing && <button type="button" onClick={handleEditClick}>Chỉnh Sửa Bài Viết</button>}
            {isEditing && (
                <form onSubmit={handleEditSubmit}>
                    <div>
                        <label>Tiêu đề:</label><br />
                        <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Mô tả:</label><br />
                        <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        />
                    </div>
                    <button type="submit">Cập Nhật Bài Viết</button>
                </form>
            )}
            {
                user && <><h4>Bình luận</h4><form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Thêm bình luận..."
                        rows={2}
                        cols={100} /><br />
                    <button type="submit">Gửi Bình Luận</button>
                </form></>
            }
            <ul>
                {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                        <li key={comment.id}>
                            <p style={{ whiteSpace: 'pre-wrap' }}>
                                {comment.text}
                            </p>
                            <p>Thời gian: <small>{new Date(comment.timestamp).toLocaleString()}</small></p>
                        </li>
                    ))
                ) : (
                    <li>Không có bình luận nào.</li>
                )}
            </ul>
        </div >


    );
}