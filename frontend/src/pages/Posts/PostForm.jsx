// src/components/posts/PostForm.jsx
import React from "react";
import { useForm } from "react-hook-form";

export default function PostForm({
    initialValues = { title: "", description: "" },
    onSubmit,
    submitLabel = "Lưu",
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: initialValues });

    const handleFormSubmit = (data) => {
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div style={{ padding: 10 }}>
                <span>Title:</span>
                <br />
                <input type="text" {...register("title", { required: true })} />
                <br />
                {errors.title && (
                    <span style={{ color: "red" }}>Yêu cầu nhập tiêu đề!</span>
                )}
                <br />

                <span>Description:</span>
                <br />
                <textarea {...register("description", { required: true })} />
                <br />
                {errors.description && (
                    <span style={{ color: "red" }}>Yêu cầu nhập mô tả!</span>
                )}
                <br />

                <button type="submit">{submitLabel}</button>
            </div>
        </form>
    );
}
