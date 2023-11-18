import React from 'react'
import {MatchButton} from '../Matching/MatchButton'
import {UserQuestionList} from "../LandingPage/UserQuestionList"

import './Dashboard.css'

export const Dashboard = () => {
  return (
    <div className = "dashboard-container">
        <div className="dashboard-header">
            <div className="header-column">
                <div className="header-column-title">
                    Quick Match
                </div>
                <MatchButton/>
            </div>
        </div>
        <div className="question-list">
            <UserQuestionList/>
        </div>
        
    </div>
  )
}
