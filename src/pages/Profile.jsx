import React from 'react';
export default function Profile({ user }) {

    return (
        <div>
            <h2>Thông tin người dùng</h2>
            <p>Đây là trang thông tin cá nhân của người dùng đã đăng nhập.</p>
            {user ? (
                <div>
                    <p><strong>Username:</strong> {user.username}</p>
                </div>
            ) : null}
        </div>
    );
}


