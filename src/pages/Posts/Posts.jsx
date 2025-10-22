import { Outlet } from "react-router-dom";

export default function Posts() {
    return (
        <div>
            <h2>Blog Post Title</h2>
            <p>This is the content of the blog post.</p>
            <Outlet />
        </div>
    );
}