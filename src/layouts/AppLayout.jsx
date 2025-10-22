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
import New from "../pages/New.jsx";
import Countries from "../pages/Countries.jsx";
import PostCount from "../pages/Posts/PostCount.jsx";
export default function AppLayout() {
    const [user, setUser] = useState();
    const navigate = useNavigate();
    function logOut() { setUser(null); navigate("/"); }
    return (
        <>
            <nav style={{ margin: 10 }}>
                <Link to="/" style={{ padding: 5 }}> Home </Link>
                <Link to="/posts" style={{ padding: 5 }}> Posts </Link>
                <Link to="/new" style={{ padding: 5 }}> New Post </Link>
                <Link to="/about" style={{ padding: 5 }}> About </Link>
                <Link to="/postcount" style={{ padding: 5 }}> Post Count </Link>
                <Link to="/countries" style={{ padding: 5 }}> Countries </Link>


                <span> | </span>
                {user && <Link to="profile" style={{ padding: 5 }}> My profile</Link>}
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
                    <Route path=":slug" element={<Post user={user} />} />
                </Route>
                <Route path="/new" element={<New />} />
                <Route path="/about" element={<About />} />
                <Route path="/postcount" element={<PostCount />} />
                <Route path="/countries" element={<Countries />} />

                <Route path="/login" element={<Login onLogin={setUser} />} />
                <Route path="/stats" element={<Stats user={user} />} />
                <Route path="*" element={<NoMatch />} />
            </Routes>
        </>
    );
}