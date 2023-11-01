import React, {useState, useEffect} from 'react'
import {Attempt} from "./Attempt"
import {AttemptView} from "./AttemptView"
import './AttemptHistory.css'

export const AttemptHistory = ({isList, setIsList}) => {
    const [attempts, setAttempts] = useState([]);
    const [selectedAttempt, setSelectedAttempt] = useState(null);

    // to be replaced with actual attempt fetch
    const fetchQuestions = async () => {
        try {
          const response = await fetch('/api/questions');
          const json = await response.json()
          if (response.ok) {
            setAttempts(json);
          }
        } catch (error) {
          console.error('Error loading questions:', error);
        }
      };
    
      useEffect(() => {
        fetchQuestions();
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
