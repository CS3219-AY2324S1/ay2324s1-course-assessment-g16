import React from 'react'
import './UserQuestion.css'
import {useState} from 'react'
import Utility from "../../Utility/Utility"

export const UserQuestion = ({question, i}) => {
    const [selected, setSelected] = useState(null);
    const toggle = (i) => {
        selected === i ? setSelected(null) : setSelected(i)
    }

    let tagClass = Utility.setDifficultyTag("user-q-tag", question.complexity);
 
  return (
    <div className="user-q-container">
        <div className="user-q-info">
            <div className="user-q-header" onClick = {() => toggle(i)}>
                <div className="user-q-name">
                    <div className="user-q-id">
                        #{i + 1}
                    </div>
                    <div className= {selected === i? "user-q-title-show" : "user-q-title"}>
                        {question.title}
                    </div>
                </div>
                <span> {selected === i? "-" : "+"} </span>
            </div>
            <div className="user-q-content">
                <div className= {selected === i? "user-q-content-expand" : "user-q-content-contract"}>
                    <div className="user-q-description"> {question.description} </div>
                </div>
            </div>
            
        </div>
        <div className= {tagClass}>
            {question.complexity}
        </div>
        <div className="user-q-tag">
            {question.category}
        </div>
    </div>
  )
}