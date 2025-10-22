import BlogPosts from "../../assets/BlogPosts";
export default function PostCount() {
    const count = Object.keys(BlogPosts).length;
    return (
        <div>
            <h2>This is the Post Count Page</h2>
            <p>Total number of posts: {count}</p>
        </div>
    );
}