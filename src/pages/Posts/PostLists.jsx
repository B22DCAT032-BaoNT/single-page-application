import React from 'react';
import BlogPosts from '../../assets/BlogPosts.jsx';
import { Link } from 'react-router-dom';
export default function PostLists() {
    return (
        <ul>
            {Object.entries(BlogPosts).map(([slug, { title }]) => (
                <li key={slug}>
                    <Link to={`/posts/${slug}`}>
                        <h3>{title}</h3>
                    </Link>
                </li>
            ))}
        </ul>
    );
}