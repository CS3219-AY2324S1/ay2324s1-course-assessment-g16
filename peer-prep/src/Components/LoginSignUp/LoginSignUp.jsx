import React from 'react'
import './LoginSignUp.css'
import {useState} from 'react'

import password_icon from '../Assets/password.png'
import user_icon from '../Assets/user.png'

export const LoginSignUp = () => {
    const [action, setAction] = useState("Log In");
  return (
    <div className="container">
        <div className="header">
            <div className="text"> {action} </div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            <div className="input">
                <img src= {user_icon} alt="" />
                <input type="text" placeholder = "Username"/>
            </div>
            <div className="input">
                <img src= {password_icon} alt="" />
                <input type="password" placeholder = "Password"/>
            </div>
        </div>
        {action === "Sign Up" ? <div></div>: <div className="forgot-password"> Forgot Password? <span> Click Here.</span></div>}
        <div className="submit-container">
            <div className={action==="Sign Up"? "submit gray": "submit"} 
            onClick = {() => {setAction("Log In")}}>Log In</div>
            <div className={action==="Log In"? "submit gray": "submit"} 
            onClick = {() => {setAction("Sign Up")}}>Sign Up</div>
        </div>
    </div>
    
  )
}


