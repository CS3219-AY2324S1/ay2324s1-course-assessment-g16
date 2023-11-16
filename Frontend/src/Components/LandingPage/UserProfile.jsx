import React from "react";
import "./UserProfile.css";
import {useState} from "react";
import {
 getUserName,
 getUserEmail,
 getUserPreferredLanguage,
 updateUserState,
} from "../../User/UserState";
import {updateUserData} from "../../User/UserServiceAPI";

import edit_icon from "../Assets/pencil.png";

export const UserProfile = ({setUsername}) => {
 const [isEdit, setEdit] = useState(false);
 const [name, setName] = useState(getUserName());
 const [email, setEmail] = useState(getUserEmail());
 const [lang, setLang] = useState(getUserPreferredLanguage());

 const updateProfile = (name, lang) => {
  updateUserData(name, email, "", lang);
  updateUserState(name, email, "", lang);
  setUsername(name);
 };

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
      // <input type="text" className="profile-input" defaultValue = {getUserPreferredLanguage()}
      //     onChange = {(e) => {setLang(e.target.value)}}/>
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
      </select>
     ) : (
      <div className="profile-detail">{lang}</div>
     )}
    </div>
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