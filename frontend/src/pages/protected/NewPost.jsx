import React, { useState } from "react";
import PostForm from "../posts/PostForm.jsx";

export default function NewPost() {
    const [message, setMessage] = useState("");

    const handleCreatePost = async (data) => {
        try {
            const response = await fetch("http://localhost:8080/api/posts", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setMessage("Bài viết đã được thêm thành công!");
            } else {
                setMessage("Thêm bài viết thất bại.");
            }
        } catch (error) {
            console.error("Lỗi khi thêm bài viết:", error);
            setMessage("Đã xảy ra lỗi khi thêm bài viết.");
        }
    };

    return (
        <>
            <h2 style={{ padding: 10 }}>Thêm Bài Viết Mới</h2>
            <PostForm onSubmit={handleCreatePost} submitLabel="Thêm Bài Viết" />
            <div style={{ marginTop: 10, color: "green" }}>{message}</div>
        </>
    );
}
