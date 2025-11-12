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
import NewPost from "../pages/NewPost.jsx";
import Countries from "../pages/Countries.jsx";
import Profile from "../pages/Profile.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import AdminProtectedRoute from "../components/AdminProtectedRoute.jsx";
import Register from "../pages/Register.jsx";
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
                <Link to="/countries" style={{ padding: 5 }}> Countries </Link>

                <span> | </span>
                {user?.role === "admin" && <Link to="/admin" style={{ padding: 5 }}> Admin Panel </Link>}
                {user && <Link to="profile" style={{ padding: 5 }}> My profile</Link>}
                {user && <Link to="/stats" style={{ padding: 5 }}> Stats </Link>}
                {!user && <Link to="/login" style={{ padding: 5 }}> Login </Link>}
                {!user && <Link to="/register" style={{ padding: 5 }}> Register </Link>}
                {user && <Link to="/newpost" style={{ padding: 5 }}> New Post </Link>}
                {user && <button type="button" onClick={logOut} style={{
                    background: 'none', border: 'none', padding: 5, cursor: 'pointer', color: 'blue'
                }}>
                    Logout
                </button>}

            </nav >

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/countries" element={<Countries />} />

                <Route path="/posts" element={<Posts />}>
                    <Route index element={<PostLists />} />
                    <Route path=":slug" element={<Post user={user} />} />
                </Route>

                <Route path="/login" element={<Login onLogin={setUser} />} />
                <Route path="/register" element={<Register />} />

                <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} /></ProtectedRoute>} />
                <Route path="/stats" element={<ProtectedRoute user={user}><Stats /></ProtectedRoute>} />
                <Route path="/newpost" element={<ProtectedRoute user={user}><NewPost /></ProtectedRoute>} />
                <Route path="*" element={<NoMatch />} />

                <Route path="/admin" element={
                    <AdminProtectedRoute user={user}>
                        <AdminPage />
                    </AdminProtectedRoute>
                } />
            </Routes>
        </>
    );
}