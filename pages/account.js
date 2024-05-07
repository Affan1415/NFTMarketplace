import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import axios from "axios";

//INTERNAL IMPORT
import Style from "../styles/account.module.css";
import images from "../img";
import From from "../AccountPage/Form/Form";

const account = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [userData, setUserData] = useState(null);

  const getTokenFromStorage = () => {
    const token = localStorage.getItem("token");
    console.log(token);
    return token;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getTokenFromStorage();
        if (!token) return; // If token is not found, return early
        const userId = localStorage.getItem("id"); // Assuming you have a function to extract user ID from the token
        const response = await axios.get(`http://127.0.0.1/api/v1/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const onDrop = async (acceptedFile) => {
    setFileUrl(acceptedFile[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  return (
    <div className={Style.account}>
      <div className={Style.account_info}>
        <h1>Profile settings</h1>
        <p>
          You can set preferred display name, create your profile URL and manage
          other personal settings.
        </p>
      </div>

      <div className={Style.account_box}>
        <div className={Style.account_box_img} {...getRootProps()}>
          <input {...getInputProps()} />
          <Image
            src={fileUrl || images.user1}
            alt="account upload"
            width={150}
            height={150}
            className={Style.account_box_img_img}
          />
          <p className={Style.account_box_img_para}>Change Image</p>
        </div>
        <div className={Style.account_box_from}>
          <From userData={userData} />
        </div>
      </div>
    </div>
  );
};

export default account;
