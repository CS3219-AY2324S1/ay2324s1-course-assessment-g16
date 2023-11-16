import React, { useState, useEffect } from 'react'; 
import { Oval } from 'react-loader-spinner'; 
import axios from 'axios'; 
import './LoadPopup.css';  

export const LoadPopup = ({ isOpen, isClose, userId, onMatchCancelled }) => { 
  const [buttonEnabled, setButtonEnabled] = useState(false); 

  useEffect(() => {
    setButtonEnabled(false); 
    const timer = setTimeout(() => { 
      setButtonEnabled(true); 
    }, 5000); 

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleCancelMatching = () => { 
    setButtonEnabled(false); 

    const URL = `http://localhost:3004/home/${userId}/matching`;
    axios.delete(URL) 
      .then(response => { 
        if (response.status !== 200) { 
          throw new Error(response.data.message); 
        } 
        console.log(response.data.message); 
        onMatchCancelled(); // Inform the parent component that the match is cancelled
      }) 
      .catch(error => { 
        console.error("Error canceling the match: ", error); 
        setButtonEnabled(true); 
      }) 
  }; 

  if (isOpen) { 
    return ( 
      <div className="load-overlay"> 
        <div className="load-popup"> 
          <h3>Finding you a match...</h3> 
          <div className="spinner"> 
            <Oval className="spinner"/> 
          </div>  
          <div> 
            <button onClick={handleCancelMatching} disabled={!buttonEnabled} className="cancel-match">Cancel Matching</button> 
          </div>     
        </div> 
      </div> 
    ); 
  } 
  return null;
};
