import React, {useState, useEffect} from "react";
import {Attempt} from "./Attempt";
import {AttemptView} from "./AttemptView";
import "./AttemptHistory.css";
import {getUserAttempts} from "../../History/HistoryServiceAPI";
import {getUserId} from "../../User/UserState";

export const AttemptHistory = ({isList, setIsList}) => {
	const [attempts, setAttempts] = useState([]);
	const [selectedAttempt, setSelectedAttempt] = useState(null);

<<<<<<< Updated upstream
    // to be replaced with actual attempt fetch
    const fetchAttempts = async () => {
        setAttempts(getUserAttempts(getUserId()));
    };
    
      useEffect(() => {
        fetchAttempts();
      }, []);

  return (
    <div className="attempt-history-container">
         {isList?
            <div className="attempt-list-container">
                {/* to be replaced by mapping over actual stored attempts */}
                {attempts.map((a, index) => (
                    <Attempt key = {index} attempt = {a} i = {index} 
                    setSelectedAttempt = {setSelectedAttempt} setIsList = {setIsList}/>))}
            </div>:
            <AttemptView attempt = {selectedAttempt} setIsList = {setIsList}/>
        }
    </div>
  )
}
=======
	// to be replaced with actual attempt fetch
	const fetchAttempts = async () => {
		const results = await getUserAttempts(getUserId());
		setAttempts(results);
		console.log("Attempts");
		console.log(attempts);
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
>>>>>>> Stashed changes
