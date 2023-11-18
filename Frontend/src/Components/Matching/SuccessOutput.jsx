import React from 'react';
import './Output.css'; 
import tick_icon from '../Assets/tick.png'

export const SuccessOutput = ({isOpen, isClose}) => {
  if (isOpen) {
    return (
      <div className="output-overlay">
          <div className="output-popup">
              <h3>Success!</h3>
              <img src= {tick_icon} className="image" alt="Tick to show successful match" />
              <p>We found you a match.</p>
              <div >
                  <button onClick={isClose} className="complete-matching">Okay</button>
              </div>    
        </div>
      </div>
    );
  }
  return null;
};
