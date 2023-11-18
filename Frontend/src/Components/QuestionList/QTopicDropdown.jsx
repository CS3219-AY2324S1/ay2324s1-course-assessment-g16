import React from "react";
import "./QDropdown.css";

export const QTopicDropdown = ({chosenTopic, setTopic}) => {
  return (
    <div className="dropdown-menu">
      <select defaultValue={chosenTopic} onChange={setTopic}>
      <option value="Sorting">Sorting</option>
      <option value="Data Structure">Data Structure</option>
      <option value="Optimization">Optimization</option>
      <option value="Recursion">Recursion</option>
      </select>
    </div>
  );
};
