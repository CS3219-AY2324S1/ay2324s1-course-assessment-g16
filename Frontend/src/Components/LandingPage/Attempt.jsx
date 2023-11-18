import React, {useEffect, useState} from "react";
import "./Attempt.css";
import Utility from "../../Utility/Utility";


export const Attempt = ({i, attempt, setSelectedAttempt, setIsList}) => {
	let tagClass = Utility.setDifficultyTag("user-q-tag", attempt.questionComplexity);

	return (
		<div
			className="attempt-container"
			onClick={() => {
				setSelectedAttempt(attempt);
				setIsList(false);
			}}
		>
			<div className="attempt-name">
				<div className="attempt-id"> #{i + 1} </div>
				<div className="attempt-title">{attempt.questionTitle}</div>
			</div>
			<div className="attempt-tags">
				<div className="user-q-tag attempt-date">{attempt.attempt_time}</div>
				<div className={tagClass}>{attempt.questionComplexity}</div>
				<div className="user-q-tag">{attempt.questionCategory}</div> 
			</div>
		</div>
	);
};
