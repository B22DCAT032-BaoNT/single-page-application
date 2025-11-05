export default function Profile({ user }) {
    return (
        <div>
            <h2>User Profile</h2>
            <p>This is the profile page for the logged-in user.</p>
            {user?.name || user?.email ? (
                <div>
                    <h3>Welcome, {user?.name}!</h3>
                    <p>Email: {user?.email}</p>
                </div>
            ) : null}
        </div>
    );
}


