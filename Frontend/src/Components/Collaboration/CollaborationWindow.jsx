import React, {useState, useEffect, useReducer, useRef} from "react";
import "./CollaborationWindow.css";
import Timer from "./Timer";
import {useNavigate} from "react-router-dom";
import socketIOClient, {Socket} from "socket.io-client";
import "firebase/auth";
import CodeEditor from "./CodeEditor";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import {getUserId} from "../../User/UserState";
import {useLocation} from "react-router-dom";
import CommunicationWindow from "./CommunicationWindow";

import axios from "axios";

const CollaborationWindow = () => {
	const [sessionStarted, setSessionStarted] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(null);
	const [toast, setToast] = useState({visible: false, message: ""});
	const [question, setQuestion] = useState(null);
	const [collaborativeInput, setCollaborativeInput] = useState([]);
	const [language, setLanguage] = useState("python");
	const [popup, setPopup] = useState(false);
	const onClosePopup = () => setPopup(false);
	const navigate = useNavigate();
	const socket = useRef(null);
	const [canExtend, setCanExtend] = useState(false);
	const location = useLocation();
	const {sessionId, collaboratorId} = location.state || {};

	useEffect(() => {
		const questionStored = JSON.parse(sessionStorage.getItem("savedQuestion"));
		if (questionStored) {
		  setQuestion(questionStored);
		}
		
		if (sessionId && collaboratorId) {
			socket.current = socketIOClient("http://localhost:3005", {
				query: {
					userId: getUserId(), // Replace with dynamic user ID
					sessionId: sessionId, // Replace with dynamic session ID
				},
				reconnection: true,
			});

			// Set up event listeners
			socket.current.on("join", (sessionId) => {
				console.log(`Joined session: ${sessionId}`);
				setSessionStarted(true);
				// Additional logic for joining session
			});

			socket.current.on("user-joined", (userId) => {
				console.log(`User ${userId} joined the session`);
				showToast("Get ready to collaborate and solve the challenge!");
				// Handle new user joining
			});

			socket.current.on('recv-question', (receivedQuestion) => {
				console.log('Received question: ', receivedQuestion);
				setQuestion(receivedQuestion);
			});

			socket.current.on("init-code", (lang, codes) => {
				setCollaborativeInput(codes);
				if (lang === "None") {
					lang = "Python";
				}
				setLanguage(lang);
			});

			socket.current.on("language-changed", (lang) => {
				setLanguage(lang);
			});

			socket.current.on("code-changed", (codes) => {
				// Update the specific line of code in the collaborative input
				setCollaborativeInput(codes);
			});

			socket.current.on("cleared", (sessionId) => {
				setCollaborativeInput([]);
			});

			socket.current.on("time-extended", (totalTimeLeft) => {
				setTimeRemaining(totalTimeLeft);
			});

			socket.current.on("system-terminate", (sessionId) => {
         	showToast("Session ended, redirecting to home page...");
				 setTimeout(() => navigate('/landing'), 1500); // Navigate to home or another route
			});

			socket.current.on("user-reconnected", (userId) => {
				console.log(`User ${userId} has reconnected`);
				// Handle the user's reconnection in the UI
				showToast(`Connection restored successfully. Let's keep going!`);
				// Additional logic can be added here
			});

			socket.current.on("notify-terminate", () => {
				console.log(`Session ${sessionId} has been terminated by another user`);
				// Handle the session termination in the UI
				showToast("Session ended, redirecting to home page...");
				setTimeout(() => navigate("/landing"), 1500); // Redirect to home or another route
				// Any cleanup or finalization logic can be added here
			});

			socket.current.on("success-reconnected", (collaborativeInput) => {
				setCollaborativeInput(collaborativeInput);
			});

			return () => {
				socket.current.disconnect();
				socket.current.off("session-started");
			};
		}
	}, [sessionId, collaboratorId]);

	useEffect(() => {
		if (question) {
		  sessionStorage.setItem("savedQuestion", JSON.stringify(question));
		}
	}, [question]);

	const userId = getUserId();

	const showToast = (message) => {
		setToast({visible: true, message});
		setTimeout(() => {
			setToast({visible: false, message: ""});
		}, 1500);
	};

	//    const handleExtendTimer = () => {
	//       console.log("Socket instance: ", socket.current);
	//     if (socket.current) {
	//      socket.current.emit('extend-timer', 900000); // 15 minutes in milliseconds
	//   showToast('Timer extended for 15 minutes');
	//   } else {
	//    console.log("Socket instance not available");
	//  }
	// };

	const handleEndSession = () => {
		// Emit a 'terminate-session' event to the server
		socket.current.emit("user-terminate"); // Replace 'session-id' with the actual session ID

		showToast("Session terminated");

		// to home or another route after a short delay
		setTimeout(() => navigate("/landing"), 1500);
	};

	//    const handleExtendTimer = () => {
	//        setTimeRemaining(timeRemaining + 900000);
	//        showToast('Timer extended for 15 minutes');
	//    };

	const formatTime = (time) => {
		const totalSeconds = Math.floor(time / 1000);
		const seconds = totalSeconds % 60;
		const minutes = Math.floor(totalSeconds / 60) % 60;
		const hours = Math.floor(totalSeconds / 3600);

		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
	};

	const handleSubmit = () => {
		socket.current.emit("user-terminate", {sessionId: "session-id"});

		showToast("Your code has been submitted");
		setTimeout(() => navigate("/landing"), 1500);
	};

	// Modify the handleExtendTimer function
	const handleExtendTimer = () => {
		if (socket.current) {
			socket.current.emit("extend-time"); // 15 minutes in milliseconds
			showToast("Timer extended for 15 minutes");
		} else {
			console.log("reponse not available");
		}
	};

	// useEffect for the countdown logic
	useEffect(() => {
		let interval;

		if (sessionStarted && timeRemaining > 0) {
			interval = setInterval(() => {
				setTimeRemaining((prevTime) => {
					// When time runs out, show the popup and stop the interval
					if (prevTime <= 1000) {
						clearInterval(interval);
						setPopup(true);
						return 0;
					}
					// Otherwise, continue counting down
					return prevTime - 1000;
				});
			}, 1000);
		}

		// Cleanup interval on component unmount or when session ends
		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [sessionStarted, timeRemaining]);

	return (
		<div className="collaboration-window">
			<Timer
				sessionId={sessionId}
				userId={userId}
				setTimeRemaining={setTimeRemaining}
				socket={socket.current}
			/>
			<Popup open={popup}>
				<div className="modal">
					<div className="header"> Time Up </div>
					<div className="content">
						<div>Do you want to extend the time ?</div>
					</div>
					<div className="actions">
						<button
							className="button extend-popup"
							onClick={(e) => {
								handleExtendTimer();
								onClosePopup();
							}}
						>
							Yes
						</button>
						<button
							className="button close-popup"
							onClick={(e) => {
								onClosePopup();
								handleEndSession();
							}}
						>
							No
						</button>
					</div>
				</div>
			</Popup>
			<div className="timer-bar">
				<div className="left">
					<span className="time-remaining">
						Time remaining: {formatTime(timeRemaining)}
					</span>
					<button className="extend-time" onClick={handleExtendTimer}>
						Extend Timer
					</button>
				</div>
				<div className="right">
					<button className="end-session" onClick={handleEndSession}>
						End Session
					</button>
				</div>
			</div>
			<div className="content-area">
				<div className="question-section">
					{question ? (
						<>
						<h2>{question.title}</h2>
						<p>{question.description}</p>
						</>
					) : (
						<p>Loading question...</p>
					)}
				</div>
				<div className="editor-section">
					{/* Placeholder for code editor */}
					{/*<p>Code editor will go here...</p>*/}
					<div className="editor-section-inner">
						<CodeEditor
							code={collaborativeInput}
							setCode={setCollaborativeInput}
							language={language}
							setLanguage={setLanguage}
							isReadOnly={false}
							socket={socket.current}
						/>
					</div>
					<div className="submit-button-container">
						<button className="submit-button" onClick={handleSubmit}>
							Submit
						</button>
					</div>
				</div>
			</div>
			{toast.visible && <div className="toast">{toast.message}</div>}
		</div>
	);
};

export default CollaborationWindow;
