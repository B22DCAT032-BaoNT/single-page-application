import { Outlet } from "react-router-dom";
import React from "react";
export default function Posts() {
    return (
        <div>
            <h2>Danh Sách Bài Viết</h2>
            <Outlet />
        </div>
    );
}