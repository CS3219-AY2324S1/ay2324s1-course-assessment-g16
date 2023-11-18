import React, {useState, useEffect} from "react";
import Editor from "@monaco-editor/react";
import "./AttemptView.css";
import Utility from "../../Utility/Utility";
import axios from "axios";

import back_icon from "../Assets/back.png";

const COLLABORATION_SERVICE_HOST = "http://localhost:3005/";

export const AttemptView = ({attempt, setIsList}) => {
	//to be replaced with attempt.code
	const [code, setCode] = useState([]);
	const [lang, setLang] = useState("python");

	let tagClass = Utility.setDifficultyTag("user-q-tag", attempt.complexity);

	const fetchCode = async () => {
		const result = await axios.get(
			COLLABORATION_SERVICE_HOST +
				"getCollaborationHistory/" +
				attempt.sessionId
		);

		if (result.status === 200) {
			console.log(result);
			setCode(result.data.codes);
			if (result.data.language === "None") {
				setLang(result.data.language);
			}
		}
	};

	useEffect(() => {
		fetchCode();
	}, []);

	const toCode = (collabInput) => {
		collabInput.sort((a, b) => {
			return a.line - b.line;
		});
		return collabInput.map((item) => item.code).join("\n");
	};

	return (
		<div className="attempt-view-container">
			<div className="back-container">
				<img
					src={back_icon}
					className="back-button"
					alt=""
					onClick={() => setIsList(true)}
				/>
			</div>
			<div className="attempt-details-container">
				<div className="attempt-q">
					<div className="attempt-q-header">
						<div className="attempt-q-name">{attempt.questionTitle}</div>
						<div className="attempt-q-tags">
							<div className={tagClass}>{attempt.questionComplexity}</div>
							<div className="user-q-tag">{attempt.questionCategory}</div>
						</div>
					</div>
					<div className="attempt-q-desc">{attempt.questionDescription}</div>
				</div>
				<div className="attempt-code">
					<Editor
						language={lang.toLowerCase()}
						theme="vs-light"
						value={toCode(code)}
						options={{
							inlineSuggest: true,
							fontSize: "16px",
							formatOnType: true,
							minimap: {enabled: false},
							readOnly: true,
						}}
					/>
				</div>
			</div>
		</div>
	);
};
