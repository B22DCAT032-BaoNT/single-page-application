import { Outlet } from "react-router-dom";

export default function Posts() {
    return (
        <div>
            <h2>Danh Sách Bài Viết</h2>
            <Outlet />
        </div>
    );
}