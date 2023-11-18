import React, { useState, useEffect } from 'react';
import { QuestionForm } from './QuestionForm';
import { Question } from './Question';
import './QuestionList.css';
import axios from 'axios';
import FilterPopup from './FilterPopup';

import { QUESTION_SERVICE_URL } from './config';

export const Questions = () => {
  const [qs, setQs] = useState([]);
  const [qId, setQId] = useState(0);
  const [isAddQ, setAddQ] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filterQns, setFilterQns] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [isFilterPopupOpen, setFilterPopupOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('No Preference');
  const [selectedLanguage, setSelectedLanguage] = useState('No Preference');
  const [selectedTopic, setSelectedTopic] = useState('No Preference');
  const [filterURL, setFilterURL] = useState('');

  const fetchQuestions = async () => {
    try {
      let response;

      if (filterApplied) {
        response = await axios.get(filterURL);
        console.log('got filter url');
      } else {
        response = await axios.get(QUESTION_SERVICE_URL);
        console.log('did not get filter url');
      }

      if (response.status === 200) {
        setFilterQns(response.data);
        setQs(response.data);
        setQId(response.data.length);
      } else {
        console.error('Error fetching questions:', response);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    // Call fetchQuestions when the component mounts or when isAddQ or filterApplied changes
    fetchQuestions();
  }, [isAddQ, filterApplied, filterURL]);

  const handleSearchChange = (e) => {
    const searchQuery = e.target.value;
    setSearchValue(searchQuery);
    const filtered = qs.filter((q) =>
      q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilterQns(filtered);
  };

  const addQuestion = async (qTitle, qDifficulty, qTopic, qDescription, qLanguage) => {
    try {
      const question = { title: qTitle, complexity: qDifficulty, category: qTopic, description: qDescription, language: qLanguage };
      const response = await axios.post(QUESTION_SERVICE_URL, question, {
        validateStatus: function (status) {
          return status >= 200 && status <= 400;
        },
      });

      if (response.status >= 200 && response.status <= 400) {
        setFilterApplied(false);
        fetchQuestions();
      }
      return response;
    } catch (error) {
      console.error('Creating question error:', error);
      return ['Unable to create question'];
    }
  };

  const updateQuestion = async (qId, qTitle, qDescription, qDifficulty, qTopic, qLanguage) => {
    try {
      const question = { title: qTitle, complexity: qDifficulty, category: qTopic, description: qDescription, language: qLanguage };
      const response = await axios.patch(QUESTION_SERVICE_URL + '/' + String(qId), question);

      if (response.status === 200) {
        setFilterApplied(false);
        await fetchQuestions();
        return response;
      } else {
        return ['Unable to edit question'];
      }
    } catch (error) {
      console.error('Updating question error:', error);
      return ['Unable to edit question'];
    }
  };

  const deleteQuestion = async (qId) => {
    try {
      const response = await axios.delete(QUESTION_SERVICE_URL + '/' + String(qId));
      const json = response.data;

      if (response.status >= 200 && response.status < 300) {
        setFilterApplied(false);
        fetchQuestions();
        return [];
      } else {
        return ['Unable to remove question'];
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      return ['Unable to remove question'];
    }
  };

  return (
    <div className="q-wrapper">
      <div className="filter-q-btn" onClick={() => setFilterPopupOpen(true)}>
        Filter Questions
      </div>

      <div className="search-entry">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      {isAddQ === false ? <div></div> : <QuestionForm questionNumber={qs.length + 1} qId={qId} setAddQ={setAddQ} setQId={setQId} addQuestion={addQuestion} />}

      {isFilterPopupOpen && (
        <FilterPopup
          isOpen={isFilterPopupOpen}
          isClose={() => setFilterPopupOpen(false)}
          chosenComplexity={selectedDifficulty}
          onChosenComplexity={(e) => setSelectedDifficulty(e.target.value)}
          chosenLanguage={selectedLanguage}
          onChosenLanguage={(e) => setSelectedLanguage(e.target.value)}
          chosenTopic={selectedTopic}
          onChosenTopic={(e) => setSelectedTopic(e.target.value)}
          onSubmission={(filterURL) => {
            setFilterURL(filterURL);
            setFilterApplied(true);
            setFilterPopupOpen(false);
          }}
        />
      )}

      {filterQns.map((q, index) => (
        <Question key={index} question={q} i={index} deleteQuestion={deleteQuestion} updateQuestion={updateQuestion} />
      ))}

      <div className="add-q-btn" onClick={() => {
        if (!isAddQ) {
          setQId(qId + 1);
          setAddQ(true);
        }
      }}>Add question</div>
    </div>
  );
};
