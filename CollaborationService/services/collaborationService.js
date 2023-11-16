const {
	initCollaborativeCode,
	updateCollaborativeInput,
	updateCollaborativeLineInput,
	updateCollaborativeLanguage,
	getCollaborativeInput,
} = require("../database/collaborativeInputDb");
const config = require("../config/config");
const axios = require("axios");

let initSession = new Map();

let sessionTracker = new Map();

const startCollaboration = async (socket, io) => {
	const collaborationSessionExist = await verifyCurrentSession(
		socket.handshake.query.sessionId,
		socket.handshake.query.userId
	);

	console.log(`Collaboration session exist: ${collaborationSessionExist}`);

	if (collaborationSessionExist) {
		console.log(`Socket starts: ${socket.id}`);

		const sessionId = socket.handshake.query.sessionId;
		const userId = socket.handshake.query.userId;
		let session;
		let sessionReq;
		try {
			sessionReq = await axios.get(
				`${config.matchingServiceUrl}/getSession/${sessionId}`
			);
			session = sessionReq.data.session;
		} catch (error) {
			console.log(error);
			socket.disconnect();
		}

		socket.join(sessionId);
		if (!sessionTracker.has(sessionId)) {
			sessionTracker.set(sessionId, 1);
			while (sessionTracker.get(sessionId) != 2) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			} 
		} else {
			sessionTracker.set(sessionId, 2);
		}
        
		socket.broadcast.to(sessionId).emit("join", sessionId);

		console.log("user joined: ", userId);
		socket.broadcast.to(sessionId).emit("user-joined", userId);

		let timerDelay = 2000;

		if (initSession.has(sessionId)) {
			console.log(`session ${sessionId} already initialized`);
			await new Promise((resolve) => setTimeout(resolve, 2000));
			io.to(sessionId).emit(
				"init-timer",
				initSession.get(sessionId)[0],
				initSession.get(sessionId)[1]
			);
			timerDelay = 1000;
		} else {
			console.log(`init session ${sessionId}`);
			initSession.set(sessionId, [
				Date.now(),
				config.DEFAULT_TIME_LIMIT[session.difficulty],
			]);
			timerDelay = 3500;
		}

		let sessionTimer = setTimeout(async () => {
			io.to(sessionId).emit("system-terminate", sessionId);

			console.log("terminate here");

			await systemTerminate(sessionId, io);
		}, initSession.get(sessionId)[1] - (Date.now() - initSession.get(sessionId)[0]) + timerDelay);

		const initValue = await initCollaborativeCode(
			initSession.get(sessionId)[0],
			sessionId,
			session.language,
            userId
		);
		const [language, codes] = initValue;

		if (language === "session-end") {
			await systemTerminate(sessionId, io);
			io.to(sessionId).emit("system-terminate", sessionId);
		}

		console.log(`init code input storage for session ${sessionId}`);
		socket.broadcast.to(sessionId).emit("init-code", language, codes);
		let questionValue;
		try {
			console.log("The session:",session)
			const questionObject = await getQuestionById(session.questionId);
			questionValue = questionObject.question;
			console.log('The question description:', questionValue);
			await new Promise((resolve) => {
				socket.broadcast.to(sessionId).emit("recv-question", questionValue);
				resolve();
			});
		} catch (error) {
			console.error("Error retrieving or emitting question:", error);
		}
		
		socket.on("update-code", async (codes) => {
			console.log(`Code changed`);
			socket.broadcast.to(sessionId).emit("code-changed", codes);
			await updateCollaborativeInput(sessionId, codes);
		});

		socket.on("update-language", async (language) => {
			console.log(`Language changed`);
			socket.broadcast.to(sessionId).emit("language-changed", language);
			await updateCollaborativeLanguage(sessionId, language);
		});

		socket.on("clear", async () => {
			console.log(`Clearing code input storage for session ${sessionId}`);

			socket.broadcast.to(sessionId).emit("cleared", sessionId);

			await updateCollaborativeInput(sessionId, []);
		});

		socket.on("extend-time", async () => {
			timerDelay = 2000;

			console.log(`Extending time for session ${sessionId}`);

			const sessionInitTime = initSession.get(sessionId)[0];
			const sessionLength = initSession.get(sessionId)[1];
			const newSessionDuration =
				sessionLength + config.EXTENSION_TIME <= config.MAX_TIME_LIMIT
					? sessionLength + config.EXTENSION_TIME
					: config.MAX_TIME_LIMIT;

			initSession.set(sessionId, [sessionInitTime, newSessionDuration]);

			console.log(
				`New session duration for session ${sessionId}: ${newSessionDuration}`
			);

			clearTimeout(sessionTimer);

			io.to(sessionId).emit(
				"time-extended",
				sessionInitTime,
				newSessionDuration
			);

			sessionTimer = setTimeout(async () => {
				io.to(sessionId).emit("system-terminate", sessionId);
				await systemTerminate(sessionId, io);
			}, newSessionDuration - (Date.now() - sessionInitTime) + timerDelay);
		});

		socket.on("user-terminate", async () => {
			console.log(`User terminated session ${sessionId}`);

			clearTimeout(sessionTimer);

			socket.broadcast.to(sessionId).emit("notify-terminate");

			let endReq;

			try {
				endReq = await axios.delete(
					`${config.matchingServiceUrl}/end/${sessionId}`
				);
			} catch (error) {
				console.log(error);
				socket.disconnect();
			}

			const isEnded = endReq.data.status;

			if (isEnded === "success") {
				console.log(`Successfully ended session ${sessionId}`);
			} else {
				console.log(`Failed to end session ${sessionId}`);
			}

			initSession.delete(sessionId);

			socket.disconnect();

			setTimeout(async () => {
				await systemTerminate(sessionId, io);
			}, config.SYSTEM_TERMINATE_TIMEOUT);
		});

		socket.on("ack-terminate", async (line, code) => {
			console.log(`User acknowledged termination for session ${sessionId}`);

			clearTimeout(sessionTimer);

			if (line > 0 && code !== "") {
				await updateCollaborativeLineInput(sessionId, line, code, userId);
			}

			socket.disconnect();
		});

		socket.on("disconnect", async () => {
			clearTimeout(sessionTimer);

			socket.broadcast.to(sessionId).emit("user-disconnected", userId);
		});

		socket.on("reconnect", async () => {
			console.log("user reconnected: ", userId);

			const collaborativeInput = await restoreCodeEditor(sessionId);

			socket.emit("success-reconnected", collaborativeInput);

			socket.broadcast.to(sessionId).emit("user-reconnected", userId);
		});
	} else {
		console.log("Collaboration session does not exist");

		let sessionId = socket.handshake.query.sessionId;

		let endReq;
		let isEnded;

		try {
			endReq = await axios.delete(
				`${config.matchingServiceUrl}/end/${sessionId}`
			);
			console.log(endReq);

		} catch (error) {
			console.log(error);
			isEnded = "error";
		}

		if (isEnded === "success") {
			console.log(`Successfully ended session ${sessionId}`);
		} else {
			console.log(`Failed to end session ${sessionId}`);
		}

		socket.disconnect();
	}
};

const systemTerminate = async (sessionId, io) => {
	console.log(`system terminated: ${sessionId}`);

	initSession.delete(sessionId);

	let endReq;
	let isEnded;

	try {
		endReq = await axios.delete(
			`${config.matchingServiceUrl}/end/${sessionId}`
		);
		isEnded = endReq.data.status;
	} catch (error) {
		console.log(error);
		isEnded = "error";
	}

	if (isEnded === "success") {
		console.log(`Successfully ended session ${sessionId}`);
	} else {
		console.log(`Failed to end session ${sessionId}`);
	}

	io.in(sessionId).disconnectSockets();
};

const verifyCurrentSession = async (sessionId, userId) => {
	console.log(`Verifying current session ${sessionId} for user ${userId}`);

	let currentSessionReq;
	let currentSessionId;

	try {
		currentSessionReq = await axios.get(
			`${config.matchingServiceUrl}/getMatchSession/${userId}`
		);
		currentSessionId = currentSessionReq.data.sessionId;
	} catch (error) {
		console.log(error);
		return false;
	}

	return sessionId === currentSessionId;
};

const restoreCodeEditor = async (sessionId) => {
	console.log(`Restoring code editor for session ${sessionId}`);

	const collaborativeInput = await getCollaborativeInput(sessionId);

	return collaborativeInput;
};

const getQuestionById = async (questionId) => {
	console.log(`Getting question ${questionId}`);

	let questionReq;

	try {
		questionReq = await axios.get(`${config.questionServiceUrl}/${questionId}`);
	} catch (error) {
		console.log(error);
		return null;
	}

	return questionReq.data;
};

const getCollaborationHistory = async (sessionId) => {
	console.log(`Getting collaborative input for session ${sessionId}`);

	return await getCollaborativeInput(sessionId);
};

module.exports = {
	startCollaboration,
	getCollaborationHistory,
};