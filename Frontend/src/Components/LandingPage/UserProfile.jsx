import React from "react";
import "./UserProfile.css";
import {useState} from "react";
import {
 getUserName,
 getUserEmail,
 getUserPreferredLanguage,
 updateUserState,
} from "../../User/UserState";
import {updateUserData, deleteUser, logoutUser} from "../../User/UserServiceAPI";
import {useNavigate} from "react-router-dom";

import edit_icon from "../Assets/pencil.png";

export const UserProfile = ({setUsername}) => {
const navigate = useNavigate();

 const [isEdit, setEdit] = useState(false);
 const [name, setName] = useState(getUserName());
 const [email, setEmail] = useState(getUserEmail());
 const [lang, setLang] = useState(getUserPreferredLanguage());

 const updateProfile = (name, lang) => {
  updateUserData(name, email, "", lang);
  updateUserState(name, email, "", lang);
  setUsername(name);
 };

 const handleLogout = async () => {
    const result = await logoutUser();
    if(result) {
        navigate("/login");
    }
 }

 const handleDeleteUser = async () => {
    const result = await deleteUser();
    if(result) {
        navigate("/login");
    }
 }

 return (
  <div className="profile-container">
   <div className="edit-container">
    <img
     src={edit_icon}
     className="profile-edit"
     alt=""
     onClick={() => setEdit(true)}
    />
   </div>

   <div className="profile-section">
    <div className="profile-info">
     <div className="profile-field">Name</div>
     {isEdit ? (
      <input
       type="text"
       className="profile-input"
       defaultValue={getUserName()}
       onChange={(e) => {
        setName(e.target.value);
       }}
      />
     ) : (
      <div className="profile-detail">{name}</div>
     )}
    </div>
    <div className="profile-info">
     <div className="profile-field">Email id</div>
     <div className="profile-detail">{email}</div>
    </div>
    <div className="profile-info">
     <div className="profile-field">Preferred Language</div>
     {isEdit ? (
      <select
       value={lang}
       onChange={(e) => {
        setLang(e.target.value);
       }}
       className="edit-profile-language-dropdown"
      >
       <option value="Python">Python</option>
       <option value="C++">C++</option>
       <option value="Java">Java</option>
       <option value="Javascript">Javascript</option>
       <option value="SQL">SQL</option>
      </select>
     ) : (
      <div className="profile-detail">{lang}</div>
     )}
    </div>
    {!isEdit ? 
        <div className="profile-delete-container">
            <div className="profile-delete-btn" onClick = {(e) => {handleDeleteUser()}}>
                Delete Account
            </div>

            <div className="logout-btn" onClick = {(e) => {handleLogout()}}>
                Logout
            </div>
        </div> : 
        <div ></div>
    }
   </div>
   

   {isEdit ? (
    <div className="profile-submit-container">
     <button
      className="cancel-btn"
      onClick={(e) => {
       setEdit(false);
      }}
     >
      Cancel
     </button>
     <button
      className="submit-btn"
      onClick={(e) => {
       setEdit(false);
       updateProfile(name, lang);
      }}
     >
      Submit
     </button>
    </div>
   ) : (
    <div></div>
   )}
  </div>
 );
};