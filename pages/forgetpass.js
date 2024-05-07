import React, { useState } from "react";
import axios from "axios";
import Style from "../loginAndSignUp/loginAndSignUp.module.css"; // Import your CSS module
import Button from "../components/Button/Button"; // Import your Button component

const ForgetPassword = () => {
    const [email, setEmail] = useState("");

    const handleResetPassword = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:3000/api/v1/users/forgotPassowrd", {
                email,
            });
            console.log(response.data); // Handle response accordingly
            alert("Password reset link sent successfully!"); // Show success message
        } catch (error) {
            console.error("Error:", error);
            // Handle error
            alert("Failed to send password reset link!"); // Show error message
        }
    };

    return (
        <div className={Style.container}>
            <h1>Forgot Password</h1>
            <div className={Style.inputContainer}>
                <label htmlFor="email">Email Address:</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={Style.user_box_social_item_img}
                />
            </div>
            <Button btnName="Reset Password" handleClick={handleResetPassword} />
        </div>
    );
};

export default ForgetPassword;
