import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);

    const getTokenFromStorage = () => {
        const token = localStorage.getItem("token");
        return token;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getTokenFromStorage();
                if (!token) return; // If token is not found, return early
                const userId = localStorage.getItem("id"); // Assuming you have a function to extract user ID from the token
                const response = await axios.get(`http://127.0.0.1:3000/api/v1/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response);
                setUserData(response.data.data.user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <h1>User Profile</h1>
            {userData ? (
                <div>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Role: {userData.role}</p>
                    {/* Add more user data fields as needed */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProfilePage;
