import React from "react";
import "./LoginSignUp.css";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import password_icon from "../Assets/password.png";
import user_icon from "../Assets/user.png";

import {loginUser} from "../../User/UserServiceAPI";
import {resetUserPasswordUsingFirebase} from "../../Authentication/UserAuthenticationController";

const MISSING_FIELD_ERROR_MESSAGE = "Please fill all fields!";

export const Login = ({setAction, setError}) => {
	const navigate = useNavigate();

	const [userEmail, setUserEmail] = useState("");
	const [userPassword, setUserPassword] = useState("");

	const isEmpty = (str) => {
		return str === "";
	};

	const handleSubmit = async () => {
		if (isEmpty(userEmail) || isEmpty(userPassword)) {
			setError(MISSING_FIELD_ERROR_MESSAGE);
		} else {
			const result = await loginUser(userEmail, userPassword);
			if (result) {
				navigate("/landing");
				setError("");
			} else {
				setError("Invalid credentials. Please try again.");
			}
		}
	};

	return (
		<div className="login-container">
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
			</div>
			<div className="forgot-password">
				Forgot Password?
				<span onClick={() => resetUserPasswordUsingFirebase(userEmail)}>
					Click Here.
				</span>
			</div>
			<div className="submit-container">
				<div
					className="submit"
					onClick={(e) => {
						handleSubmit();
					}}
				>
					Log In
				</div>
			</div>
			<div className="signup-nav">
				Don't have an account?
				<span
					onClick={() => {
						setError("");
						setAction("Sign Up");
					}}
				>
					{" "}
					Sign Up.
				</span>
			</div>
		</div>
	);
};
