import React, { useState } from 'react';
import './QuestionEdit.css';
import { QDifficultyDropdown } from './QDifficultyDropdown.jsx';

import delete_icon from '../Assets/bin.png';

export const QuestionEdit = ({ q, index, updateQ, setEdit }) => {
    const [title, setTitle] = useState(q.title);
    const [difficulty, setDifficulty] = useState(q.complexity);
    const [topic, setTopic] = useState(q.category);
    const [description, setDescription] = useState(q.description);

  function handleChosenDifficulty(e) {
      return setDifficulty(e.target.value);
  }

  return (
    <div className= "form-container">
        <div className="container">
            <div className="q-form-header">
                <div className="q-form-name">
                    <div className="q-form-id">#{index + 1}</div>
                    <input type="text" className="q-form-title q-form-input" defaultValue = {q.title}
                    onChange = {(e) => {setTitle(e.target.value)}}/> 
                </div>
                <span> - </span>
            </div>
            
            <div className="q-form-content">
                <div className="q-form-tags-container">
                    <div className= "q-form-tags">
                        <QDifficultyDropdown chosenDifficulty = {difficulty} setDifficulty = {handleChosenDifficulty}/>
                        <input type="text" className="q-form-tag q-form-input" defaultValue = {q.category}
                        onChange = {(e) => {setTopic(e.target.value)}}/>
                     
                    </div>
                </div>

                <textarea type="text" className="q-form-description q-form-input" defaultValue={q.description}
                    onChange={(e) => {setDescription(e.target.value);}}/>

                <div className="btn-container">
                    <button type = "cancel" className="cancel-btn" onClick = {(e)=> {setEdit(false)}}>Cancel</button>
                    <button className="submit-btn" onClick = {(e) => {
                        setEdit(false);
                        updateQ(q.id, title, description, difficulty, topic)
                        }}>Submit
                    </button> 
                </div> 
            </div>
        </div>
        <div className="delete-btn">
                <img src= {delete_icon} alt="" />
        </div>
    </div>
  )
}