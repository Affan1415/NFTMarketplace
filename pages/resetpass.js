import React, { useState } from "react";
import axios from "axios";
import Style from "../loginAndSignUp/loginAndSignUp.module.css";
import Button from "../components/Button/Button";

const ResetPassword = () => {
    const [secretKey, setSecretKey] = useState("");
    const [password, setNewPassword] = useState("");
    const [passwordConfirm, setConfirmNewPassword] = useState("");

    const handleResetPassword = async () => {
        try {
            if (password !== passwordConfirm) {
                alert("New password and confirm password must match!");
                return;
            }

            // Retrieve JWT token from local storage
            const token = localStorage.getItem("token");

            const response = await axios.patch(`http://127.0.0.1:3000/api/v1/users/resetPassowrd/${secretKey}`, {
                password,
                passwordConfirm
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Include JWT token in headers
                }
            });

            console.log(response.data);
            alert("Password reset successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to reset password!");
        }
    };

    return (
        <div className={Style.container}>
            <h1>Reset Password</h1>
            <div className={Style.inputContainer}>
                <label htmlFor="secretKey">Secret Key:</label>
                <input
                    type="text"
                    id="secretKey"
                    placeholder="Enter secret key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                />
            </div>
            <div className={Style.inputContainer}>
                <label htmlFor="password">New Password:</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <div className={Style.inputContainer}>
                <label htmlFor="passwordConfirm">Confirm New Password:</label>
                <input
                    type="password"
                    id="passwordConfirm"
                    placeholder="Confirm new password"
                    value={passwordConfirm}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
            </div>
            <Button btnName="Reset Password" handleClick={handleResetPassword} />
        </div>
    );
};

export default ResetPassword;
