import React, { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { Button } from "../components/componentsindex";
import Style from "../styles/contactus.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import axios from "axios";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    //e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:3000/api/v1/contact/contact-us",
        formData
      );
      alert("email sent successfully")
      setFeedback("Message sent successfully!");
      // Clear form data after successful submission
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setFeedback("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={Style.contactus}>
      <div className={Style.contactus_box}>
        <h1>Contact</h1>
        <div className={Style.contactus_box_box}>
          <div className={Style.contactus_box_box_left}>
            {/* Left section content */}
          </div>
          <div className={Style.contactus_box_box_right}>
            <form onSubmit={handleSubmit}>
              <div className={formStyle.Form_box_input}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={formStyle.Form_box_input_userName}
                />
              </div>
              <div className={formStyle.Form_box_input}>
                <label htmlFor="email">Email</label>
                <div className={formStyle.Form_box_input_box}>
                  <div className={formStyle.Form_box_input_box_icon}>
                    <HiOutlineMail />
                  </div>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className={formStyle.Form_box_input}>
                <label htmlFor="message">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  rows="6"
                ></textarea>
              </div>
              <Button btnName="Send Message" handleClick={handleSubmit} classStyle={Style.button} />
              {feedback && <p>{feedback}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
