import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import NoMatch from "../pages/NoMatch.jsx";
import Posts from "../pages/Posts/Posts.jsx";
import PostLists from "../pages/Posts/PostLists.jsx";
import Post from "../pages/Posts/Post.jsx";
import Login from "../pages/Login.jsx";
import Stats from "../pages/Stats.jsx";

export default function AppLayout() {
    const [user, setUser] = useState();
    const navigate = useNavigate();
    function logOut() { setUser(null); navigate("/"); }
    return (
        <>
            <nav style={{ margin: 10 }}>
                <Link to="/" style={{ padding: 5 }}> Home </Link>
                <Link to="/posts" style={{ padding: 5 }}> Posts </Link>
                <Link to="/about" style={{ padding: 5 }}> About </Link>
                <span> | </span>
                {user && <Link to="/stats" style={{ padding: 5 }}> Stats </Link>}
                {!user && <Link to="/login" style={{ padding: 5 }}> Login </Link>}
                {user && <button type="button" onClick={logOut} style={{
                    background: 'none', border: 'none', padding: 5, cursor: 'pointer', color: 'blue'
                }}>
                    Logout
                </button>}

            </nav >



            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts" element={<Posts />}>
                    <Route index element={<PostLists />} />
                    <Route path=":slug" element={<Post />} />
                </Route> <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login onLogin={setUser} />} />
                <Route path="/stats" element={<Stats user={user} />} />
                <Route path="*" element={<NoMatch />} />
            </Routes>
        </>
    );
}