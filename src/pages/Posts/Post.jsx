import { useParams, Navigate, useLocation } from "react-router-dom";
import BlogPosts from "../../assets/BlogPosts.jsx";

export default function Post({ user }) {
    const location = useLocation();
    if (!user) {
        return (<Navigate to="/login" state={{ from: location }} replace />);

    }
    const { slug } = useParams();
    const post = BlogPosts[slug];
    if (!post) {
        return <div>Post not found</div>;
    }
    const { title, description } = post;
    return (
        <div style={{ padding: '20px' }}>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}