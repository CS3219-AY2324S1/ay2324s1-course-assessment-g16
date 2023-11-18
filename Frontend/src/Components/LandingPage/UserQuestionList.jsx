import React, { useState, useEffect } from 'react'
import {UserQuestion} from "./UserQuestion"
import './UserQuestionList.css'
import axios from 'axios';

import { QUESTION_SERVICE_URL } from '../QuestionList/config';

export const UserQuestionList = () => {
    const [qs, setQs] = useState([]);

    const fetchQuestions = async () => {
        try {
          const response = await axios.get(QUESTION_SERVICE_URL);
           setQs(response.data);
        } catch (error) {
          console.error('Error loading questions:', error);
        }
      };
    
      useEffect(() => {
        fetchQuestions();
      }, []);
  return (
    <div className = "q-list-container">
        {qs.map((q, index) => (
          <UserQuestion key = {index} question = {q} i = {index}/>
        ))}
    </div>
  )
}
