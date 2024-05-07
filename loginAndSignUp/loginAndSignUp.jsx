import React, { useState } from "react";
import Image from "next/image";
import axios from "axios"; // Import Axios
import { useRouter } from 'next/router';
//INTERNAL IMPORT
import Style from "./loginAndSignUp.module.css";
import images from "../img";
import { Button } from "../components/componentsindex.js";

const LoginAndSignUp = () => {
  const [activeBtn, setActiveBtn] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const socialImage = [
    {
      social: images.facebook,
      name: "Continue with Facebook",
    },
    {
      social: images.twitter,
      name: "Continue with twitter",
    },
    {
      social: images.facebook,
      name: "Continue with Facebook",
    },
  ];

  const handleLogin = async () => {
    try {
      console.log(email, password);
      const response = await axios.post("http://127.0.0.1:3000/api/v1/users/login", {
        email,
        password,
      });
      console.log(response.data.data.user._id);
      const token = response.data.token;
      console.log("token",token);

      // Save the token to local storage
      localStorage.setItem('token', token);
      localStorage.setItem('id', response.data.data.user._id);

      // Redirect the user to the main page
    router.push('/myprofile');
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hello");

    handleLogin();
  };

  const handleClick = () => {
    // Handle button click action here
    console.log("Button clicked");
  };

  return (
    <div className={Style.user}>
      <div className={Style.user_box}>
        <div className={Style.user_box_social}>
          {socialImage.map((el, i) => (
            <div
              key={i + 1}
              onClick={() => setActiveBtn(i + 1)}
              className={`${Style.user_box_social_item} ${activeBtn === i + 1 ? Style.active : ""
                }`}
            >
              <Image
                src={el.social}
                alt={el.name}
                width={30}
                height={30}
                className={Style.user_box_social_item_img}
              />
              <p>
                <span>{el.name}</span>
              </p>
            </div>
          ))}
        </div>
        <p className={Style.user_box_or}>OR</p>

        <div className={Style.user_box_input}>
          <form onSubmit={handleSubmit}>
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
              <label
                htmlFor="password"
                className={Style.user_box_input_box_label}
              >
                <p>Password</p>
                <p>
                  <a href="#">Forget password</a>
                </p>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button btnName="Continue" classStyle={Style.button} handleClick={handleLogin} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAndSignUp;
