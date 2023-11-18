import React, {useState} from 'react'
import './Question.css'
import delete_icon from '../Assets/bin.png'
import edit_icon from '../Assets/pencil.png'
import {QuestionEdit} from "./QuestionEdit"

export const Question = ({question, i, deleteQuestion, updateQuestion}) => {
    const [selected, setSelected] = useState(null);
    const toggle = (i) => {
        if (!isEdit) {
            selected === i ? setSelected(null) : setSelected(i)
        }
    };
    const [isEdit, setEdit] = useState(false);
    let tagClass = "q-tag";

    if (question.complexity) {
        if(question.complexity.toLowerCase() === "easy") {
            tagClass += " q-tag-green"
        } else if (question.complexity.toLowerCase() === "medium") {
            tagClass += " q-tag-orange"
        } else if (question.complexity.toLowerCase() === "hard"){
            tagClass += " q-tag-red"
        } else {
            tagClass += " q-tag-white"
        }
    }
  return (
    <div>
        {isEdit? <QuestionEdit q = {question} index = {i} updateQ = {updateQuestion} setEdit = {setEdit}/>:
        <div className= "question-container">
            <div className="question">
                <div className="q-header" onClick = {() => toggle(i)}>
                    <div className="q-name">
                        <div className="q-id">#{i + 1}</div>
                        <div className={selected === i ? "q-title-show": "q-title"}>{question.title}</div>
                    </div>
                    <span> {selected === i ? "-" : "+"}</span>
                </div>
                
                <div className="q-content">
                    <div className= {selected === i ? "q-content-expand": "q-content-contract"}>
                            <div className="q-tag-container">
                                <div className="q-tags">
                                    <div className= {tagClass}>{question.complexity}</div>
                                    <div className="q-tag">{question.category}</div>
                                </div>
                                <div className="q-edit" onClick = {()=> setEdit(true)}>
                                    <img src = {edit_icon} alt=""/>
                                </div>
                            </div>

                            <div className="q-description">{question.description}</div>
                    </div>
                </div>
                
            </div>
            <div className="delete-btn" onClick = {(e) => deleteQuestion(question.id)}>
                <img src= {delete_icon} alt="" />
            </div>
        </div>
        }
    </div>
    )
}