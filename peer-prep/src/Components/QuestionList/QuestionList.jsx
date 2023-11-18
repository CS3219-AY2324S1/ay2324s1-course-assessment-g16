import React, { useState, useEffect } from 'react'
import { QuestionForm } from './QuestionForm'
import { Question } from './Question'
import './QuestionList.css'

import QuestionModel from '../../DataModel/QuestionModel'
import { setupQuestionDatabase, retrieveQuestionDatabase, updateLocalQuestionDatabase } from "../../Utility/localStorage"

export const Questions = () => {
  // Initializing Database
  setupQuestionDatabase();

  const [database, setDatabase] = useState(retrieveQuestionDatabase());
  const [qId, setQId] = useState(0);
  const [isAddQ, setAddQ] = useState(false);
  const [qs, setQs] = useState([])
 

  // Add a new Question
  const addQuestion = (qTitle, qDifficulty, qTopic, qDescription) => {
    // Add in Database and Upload into Storage
    let newQuestion = new QuestionModel(qId, qTitle, qDescription, qDifficulty, qTopic);
    let isAddedSuccessfully = database.addQuestion(newQuestion);
    
    updateLocalDatabase();
    updateStates();

    console.log("Is Additon Successful: " + (isAddedSuccessfully.length === 0));
    console.log("Errors While Adding: " + (isAddedSuccessfully.length === 0 ? "None" : isAddedSuccessfully))

    return isAddedSuccessfully;
  }

  // Delete a Question
  const deleteQuestion = (questionId) => {
    let isDeletedSuccessfully = database.deleteQuestion(questionId);

    updateLocalDatabase();
    updateStates();

    console.log("Is Deletion Successful: " + isDeletedSuccessfully);

    return isDeletedSuccessfully;
  }

  // Update an existing Question
  const updateQuestion = (qId, qTitle, qDescription, qDifficulty, qTopic) => {
    let updatedQuestion = new QuestionModel(qId, qTitle, qDescription, qDifficulty, qTopic);
    let isUpdateSuccessful = database.updateQuestion(updatedQuestion);

    updateLocalDatabase();
    updateStates();

    console.log("Is Update Successful: " + (isUpdateSuccessful.length === 0));
    console.log("Errors While Updating: " + (isUpdateSuccessful.length === 0 ? "None" : isUpdateSuccessful))

    return isUpdateSuccessful;
  }

  const updateLocalDatabase = () => {
    // Updating Database in Local Storage
    updateLocalQuestionDatabase(database);
  }

  const updateStates = () => {
    // Update States
    setQs(Array.from(database.database));
    setQId(Array.from(database.database).length === 0 ? 0 : Array.from(database.database).sort((a, b) => a[0] < b[0]).slice(-1)[0][0]);
  }

  // To load data on mount
  useEffect(() => {
    updateStates();
  }, [])

  return (
    
    <div className="q-wrapper">
      {qs.map((q, index) => (
          <Question key = {index} question = {q[1]} i = {index} deleteQuestion = {deleteQuestion} updateQuestion = {updateQuestion}/>
        ))}
  
      {isAddQ === false ? <div></div> : 
                          <QuestionForm questionNumber = {Array.from(database.database).length + 1} qId = {qId} addQuestion = {addQuestion} setAddQ = {setAddQ} setQId = {setQId}/>}
      <div className="add-q-btn" onClick = {() => {
        if (!isAddQ) {
          setQId(qId + 1);
          setAddQ(true);
        }
    }}> Add question</div>
    </div>
  )
}
