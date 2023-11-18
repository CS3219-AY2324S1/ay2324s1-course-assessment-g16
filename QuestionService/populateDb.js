const mongoose = require('mongoose');
const Question = require('./models/questionModel'); 
const config = require("./config/config");

const questionsData = [
  {
    title: 'Test Question 1',
    description: 'This is for Test Question 1',
    complexity: 'Easy',
    category: 'Data Structures',
    language: 'Other Languages',
  },
  {
    title: 'Test Question 2',
    description: 'This is for Test Question 2',
    complexity: 'Medium',
    category: 'Sorting',
    language: 'SQL',
  },
  {
    title: 'Test Question 3',
    description: 'This is for Test Question 3',
    complexity: 'Hard',
    category: 'Recursion',
    language: 'Other Languages',
  },
  {
    title: 'Test Question 4',
    description: 'This is for Test Question 4',
    complexity: 'Easy',
    category: 'Optimisation',
    language: 'Other Languages',
  },
  {
    title: 'Test Question 5',
    description: 'This is for Test Question 5',
    complexity: 'Medium',
    category: 'Data Structure',
    language: 'Other Languages',
  }
];

async function populateDB() {
  try {
    await mongoose.connect(config.mongodbUri);
    await Question.deleteMany({});
    const createdQuestions = await Question.insertMany(questionsData);
    console.log('Questions successfully added to database:', createdQuestions);
  } catch (error) {
    console.error('Unable to populate database:', error);
  } 
}

populateDB();
