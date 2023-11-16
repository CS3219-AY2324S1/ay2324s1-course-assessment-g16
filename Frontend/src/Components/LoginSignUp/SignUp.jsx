import React from "react";
import "./LoginSignUp.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import password_icon from "../Assets/password.png";
import user_icon from "../Assets/user.png";

import {registerUser} from "../../User/UserServiceAPI";

const MISSING_FIELD_ERROR_MESSAGE = "Please fill all fields!";

export const SignUp = ({setAction, setError}) => {
 const navigate = useNavigate();

 const [userEmail, setUserEmail] = useState("");
 const [userPassword, setUserPassword] = useState("");
 const [userName, setUserName] = useState("");
 const [preferredLang, setPreferredLang] = useState("Python");

 const isEmpty = (str) => {
  return str === "";
 };

 const handleSubmit = async () => {
  if (isEmpty(userEmail)  || isEmpty(userPassword) || isEmpty(userName)) {
   setError(MISSING_FIELD_ERROR_MESSAGE);
  } else {
   const result = await registerUser(
    userName,
    userEmail,
    userPassword,
    "GitHub ID Placeholder",
    preferredLang
   );

   if (result.success) {
    navigate("/landing");
   } else {
    console.log(result);
    setError(result.message);
   }
  }
 };

 return (
  <div className="signup-container">
   <div className="inputs">
    <div className="input">
     <div className="input-container">
      <img src={user_icon} alt="" />
      <input
       type="text"
       placeholder="Email"
       onChange={(e) => {
        setUserEmail(e.target.value);
       }}
       value={userEmail}
      />
     </div>
    </div>
    <div className="input">
     <div className="input-container">
      <img src={password_icon} alt="" />
      <input
       type="password"
       placeholder="Password"
       onChange={(e) => {
        setUserPassword(e.target.value);
       }}
       value={userPassword}
      />
     </div>
    </div>
    <div className="input">
     <input
      type="text"
      placeholder="Name"
      onChange={(e) => {
       setUserName(e.target.value);
      }}
      value={userName}
     />
    </div>
    <div className="input">
     <select
      value={preferredLang}
      onChange={(e) => {
       setPreferredLang(e.target.value);
      }}
      className="signup-language-dropdown"
     >
      <option value="Python">Python</option>
      <option value="C++">C++</option>
      <option value="Java">Java</option>
      <option value="Javascript">Javascript</option>
     </select>
    </div>
   </div>

   <div className="submit-container">
    <div
     className="submit"
     onClick={(e) => {
      handleSubmit();
     }}
    >
     Sign Up
    </div>
   </div>
   <div className="login-nav">
    Already have an account?
    <span
     onClick={() => {
      setError("");
      setAction("Log In");
     }}
    >
     {" "}
     Log In.
    </span>
   </div>
  </div>
 );
};