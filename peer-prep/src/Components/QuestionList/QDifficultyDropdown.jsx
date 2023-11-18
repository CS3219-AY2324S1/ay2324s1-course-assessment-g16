import React from "react";
import "./QDifficultyDropdown.css";

export const QDifficultyDropdown = ({chosenDifficulty, setDifficulty}) => {
  return (
    <div className="dropdown-menu">
      <select defaultValue={chosenDifficulty} onChange={setDifficulty}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
};