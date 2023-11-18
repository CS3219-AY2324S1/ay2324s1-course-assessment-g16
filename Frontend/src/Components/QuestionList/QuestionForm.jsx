import React, { useState } from 'react'
import './QuestionForm.css'
import delete_icon from '../Assets/bin.png'
import { QDifficultyDropdown } from './QDifficultyDropdown'
import { QLanguageDropdown } from './QLanguageDropdown';
import { QTopicDropdown } from './QTopicDropdown'; 
export const MISSING_FIELD_ERROR_MESSAGE = "Please fill all fields!";

export const QuestionForm = ({qId, addQuestion, setAddQ, setQId, questionNumber}) => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("Sorting");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("SQL");

  const [isDuplicateTitle, setIsDuplicateTitle] = useState(false);
  const [isDuplicateDesc, setIsDuplicateDesc] = useState(false);
  const [isMissingField, setIsMissingField] = useState(false);

  const [titleError, setTitleError] = useState("");
  const [descError, setDescError] = useState("");
  const [missingFieldError, setMissingFieldError] = useState(MISSING_FIELD_ERROR_MESSAGE)


  const isEmpty = (str) => {
    return str === ""
  };

  const setErrorVar = (errors) => {
    if('duplicateDescription' in errors) {
      setIsDuplicateDesc(true);
      setDescError(errors.duplicateDescription)
    } else {
      setIsDuplicateDesc(false);
    }
    
    if('duplicateTitle' in errors) {
      setIsDuplicateTitle(true);
      setTitleError(errors.duplicateTitle);
    } else {
      setIsDuplicateTitle(false);
    }
  };

  const handleSubmit = (toggleAddQ, addQ) => async e => {
    e.preventDefault();
    if(isEmpty(title) || isEmpty(difficulty) || isEmpty(topic) || isEmpty(description)) {
      setIsMissingField(true);
    } else {
      setIsMissingField(false);
      const response = await addQ(title, difficulty, topic, description, language);
      if(response.status === 200) {
        toggleAddQ(false);
      } else {
        let res = response.data;
        setErrorVar(res.errors)
      }
    }
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

        {isDuplicateTitle? <div className="error-text">{titleError}</div> : <div></div>}
        
        <div className="q-form-content">
          <div className="q-form-tags">
              <QDifficultyDropdown chosenDifficulty = {difficulty} setDifficulty = {handleChosenDifficulty}/>
              <QTopicDropdown chosenTopic={topic} setTopic={(e) => setTopic(e.target.value)} />
              <QLanguageDropdown chosenLanguage={language} setLanguage={(e) => setLanguage(e.target.value)} />
             </div>
             <textarea type="text" className="q-form-description q-form-input" 
            placeholder = "Question description"
            onChange = {
              (e) => setDescription(e.target.value)
           }/>

           {isDuplicateDesc? <div className="error-text">{descError}</div> : <div></div>}
           {isMissingField? <div className = "error-text">{missingFieldError}</div>: <div></div>}

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