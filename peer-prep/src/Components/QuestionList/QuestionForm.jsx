import React, { useState } from 'react'
import './QuestionForm.css'
import delete_icon from '../Assets/bin.png'
import { QDifficultyDropdown } from './QDifficultyDropdown'

export const QuestionForm = ({qId, addQuestion, setAddQ, setQId, questionNumber}) => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (toggleAddQ, addQ) => e => {
    e.preventDefault();
    toggleAddQ(false);

    const response = addQ(title, difficulty, topic, description);
    return response; // If array length is 0, then successful, else can index through it for errors
  }

  function handleChosenDifficulty(e) {
    return setDifficulty(e.target.value)
  }

  return (
    <div className="form-container">
      <form className = "container" onSubmit={handleSubmit(setAddQ, addQuestion)}>
        <div className="q-form-header">
          <div className="q-form-id">#{questionNumber}</div>
          <input type="text" className="q-form-title q-form-input" 
          placeholder='Question Title' onChange = {
            (e) => setTitle(e.target.value)
          }/>
        </div>
        
        <div className="q-form-content">
          <div className="q-form-tags">
                <QDifficultyDropdown chosenDifficulty = {difficulty} setDifficulty = {handleChosenDifficulty}/>
                <input type="text" className="q-form-tag q-form-input" 
                placeholder = 'Topic'
                onChange = {
                  (e) => setTopic(e.target.value)
                }
                />
            
              </div>
              <textarea type="text" className="q-form-description q-form-input" 
              placeholder = "Question description"
              onChange = {
                (e) => setDescription(e.target.value)
            }/>

              <div className="btn-container">
                <button type = "cancel" className="cancel-btn" onClick = {(e)=> {setAddQ(false); 
                  setQId(qId - 1)}}>Cancel</button>
                <button type = "submit" className="submit-btn">Submit</button>
              </div>
        </div>
      </form>
      <div className="ghost-btn">
        <img src= {delete_icon} alt=""/>
      </div>
    </div>
  )
}