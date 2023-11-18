import {React, useState, useEffect, useCallback} from "react";
import "./NavigationPanel.css";

import home_icon from "../Assets/home.png";
import user_icon from "../Assets/user-prof.png";
import dummy_user from "../Assets/David.png";
import history_icon from "../Assets/history.png";

export const NavigationPanel = ({setPageName, setIsList, userName}) => {
 return (
  <div className="navigation-panel">
   <div className="user-header">
    <img src={dummy_user} className="user-icon" alt="" />
    <div className="user-name">{userName}</div>
   </div>
   <div className="nav-tabs">
    <div
     className="nav-tab"
     onClick={() => {
      setPageName("Dashboard");
     }}
    >
     <img src={home_icon} className="nav-icon" alt="" />
     <div className="nav-text"> Dashboard </div>
    </div>
    <div
     className="nav-tab"
     onClick={() => {
      setPageName("Attempt History");
      setIsList(true);
     }}
    >
     <img src={history_icon} className="nav-icon" alt="" />
     <div className="nav-text"> Attempt History </div>
    </div>
    <div
     className="nav-tab"
     onClick={() => {
      setPageName("User Profile");
     }}
    >
     <img src={user_icon} className="nav-icon" alt="" />
     <div className="nav-text"> User Profile</div>
    </div>
   </div>
  </div>
 );
};