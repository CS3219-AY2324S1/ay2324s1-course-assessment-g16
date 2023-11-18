import React from 'react';
import './Output.css'; 
import error_icon from '../Assets/cross.png'; 

export const NotSuccessOutput = ({ isOpen, isClose }) => {
    if (isOpen) {
        return (
            <div className="output-overlay">
                <div className="output-popup">
                    <h3>No Match Found!</h3>
                    <img src={error_icon} className="image" alt="Error icon" />
                    <p>Try Again!</p>
                    <div>
                        <button onClick={isClose} className="complete-matching">Okay</button>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

