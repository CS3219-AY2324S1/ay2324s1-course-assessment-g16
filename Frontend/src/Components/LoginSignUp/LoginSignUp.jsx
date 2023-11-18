import React from "react";
import "./LoginSignUp.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import {Login} from "./Login";
import {SignUp} from "./SignUp";

export const LoginSignUp = () => {
	const [action, setAction] = useState("Log In");
	const [error, setError] = useState("");

	return (
		<div className="container-loginsignup">
			<div className="header">
				<div className="text"> {action} </div>
				<div className="underline"></div>
			</div>
			<div className="login-signup-error">{error}</div>
			{action === "Log In" ? (
				<Login setAction={setAction} setError={setError} />
			) : (
				<SignUp setAction={setAction} setError={setError} />
			)}
		</div>
	);
};
