import React, { useState } from 'react';
import axios from 'axios';
import { LoadPopup } from './LoadPopup';
import MatchPopup from './MatchPopup'; 
import './MatchButton.css';
import { SuccessOutput } from './SuccessOutput';

export const MatchButton = ({}) => {
    const [viewPopup, setViewPopup] = useState(false);
    const [goToLoadPopup, setGoToLoadPopup] = useState(false);
    const [showSuccessOutput, setShowSuccessOutput] = useState(false);
    const [collaboratorId, setCollaboratorId] = useState(null);

// States for new match criteria
//    const [chosenDifficulty, setChosenDifficulty] = useState("No Preference"); 
//    const [chosenLanguage, setChosenLanguage] = useState("No Preference");
//    const [chosenProficiency, setChosenProficiency] = useState("No Preference");
//    const [chosenTopic, setChosenTopic] = useState("No Preference");

    const handleMatchInitiation = (matchCriteria) => {
        setGoToLoadPopup(true);
        setViewPopup(false);

        axios.post(`/api/match`, matchCriteria) // replace /${props.userId} with how we access userId
        .then(response => {
            if (response.data.status === 'success') { 
                console.log("Matched with: ", response.data.collaboratorId);
                setCollaboratorId(response.data.collaboratorId);
                setShowSuccessOutput(true); // Triggers the SuccessOutput popup
            } else {
                console.log("No match found");
                setShowSuccessOutput(false); // SuccessOutput popup does not show
            }
            setGoToLoadPopup(false); // Close the loading popup
        })
        .catch(error => {
            console.error("Error finding a match: ", error);
            setGoToLoadPopup(false); // Close the loading popup
          
        });

    };

    return(
    <div className="match-button-container">
        <button onClick = {() => setViewPopup(true)} className="find-match-button">
            Find Your Match
        </button>

        {viewPopup && ( 
            <MatchPopup
            isOpen={viewPopup}
            isClose={() => setViewPopup(false)}
            onMatchInitiation={handleMatchInitiation}
        />
        )}

        {goToLoadPopup && (
            <LoadPopup
            isOpen={goToLoadPopup}
            isClose={() => setGoToLoadPopup(false)}
            />
        )}

        {showSuccessOutput && (
            <SuccessOutput
            isOpen={showSuccessOutput}
            isClose={() => setShowSuccessOutput(false)}
            />
        )}
        </div>
        );
    }
