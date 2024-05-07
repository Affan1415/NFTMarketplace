import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Style from "../loginAndSignUp/loginAndSignUp.module.css";
import Button from "../components/Button/Button"; // Import the Button component

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:3000/api/v1/users/signup", {
        email,
        password,
      });
      const { token, data } = response.data;

      // Save token and ID to local storage
      localStorage.setItem("token", token);
      localStorage.setItem("id", data.user._id);

      // Show signup success alert
      alert("Signup successful!");

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  return (
    <div className={Style.login}>
      <div className={Style.login_box}>
        <h1>SignUp</h1>
        <div className={Style.user_box_input}>
          <div className={Style.user_box_input_box}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              placeholder="example@emample.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={Style.user_box_input_box}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Use Button component with onClick handler */}
          <Button btnName="Signup" classStyle={Style.button} handleClick={handleSignup} />
        </div>
        <p className={Style.login_box_para}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
