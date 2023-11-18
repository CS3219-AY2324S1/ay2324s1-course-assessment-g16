import React, {useState, useEffect} from "react";
import {Attempt} from "./Attempt";
import {AttemptView} from "./AttemptView";
import "./AttemptHistory.css";
import {getUserAttempts} from "../../History/HistoryServiceAPI";
import {getUserId} from "../../User/UserState";

export const AttemptHistory = ({isList, setIsList}) => {
	const [attempts, setAttempts] = useState([]);
	const [selectedAttempt, setSelectedAttempt] = useState(null);

	const fetchAttempts = async () => {
		const results = await getUserAttempts(getUserId());
		if (results === null) {
			console.log("No Attempt")
			return;
		}

		console.log(results)
		setAttempts(results);
	};

	useEffect(() => {
		fetchAttempts();
	}, []);

	return (
		<div className="attempt-history-container">
			{isList ? (
				<div className="attempt-list-container">
					{/* to be replaced by mapping over actual stored attempts */}
					{attempts.map((a, index) => (
						<Attempt
							key={index}
							attempt={a}
							i={index}
							setSelectedAttempt={setSelectedAttempt}
							setIsList={setIsList}
						/>
					))}
				</div>
			) : (
				<AttemptView attempt={selectedAttempt} setIsList={setIsList} />
			)}
		</div>
	);
};
