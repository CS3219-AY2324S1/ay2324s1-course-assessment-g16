import React from 'react';
import './Output.css'; 
import cross_icon from '../Assets/cross.png'

export const ErrorOutput = ({isOpen, isClose}) => {
  if (isOpen) {
    return (
      <div className="output-overlay">
          <div className="output-popup">
              <h3>Sorry :(</h3>
              <img src= {cross_icon} className="image" alt="Tick to show successful match" />
              <p>There are no matches for <br/> you  now. Please try again later.</p>
              <div >
                  <button onClick={isClose} className="complete-matching">Okay</button>
              </div>    
        </div>
      </div>
    );
  }
};