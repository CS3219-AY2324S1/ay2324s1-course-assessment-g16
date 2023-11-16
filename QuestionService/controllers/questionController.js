const Question = require('../models/questionModel')
const mongoose = require('mongoose')

const checkIdValidity = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(500).json({ error: 'Invalid question ID'});
  }
}

const checkQuestionValidity = (question) => {
  if (!question) {
    res.status(500).json({ error: 'Question not found'});
  }
}

const getAllQuestions = async (req, res) => {
  try {
    const { complexity, category, language } = req.query;
    const filter = {};

    if (complexity) {
      filter.complexity = complexity;
    } 
    if (language) {
      filter.language = language;
    } 
    if (category) {
      filter.category = category;
    }

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving questions' });
  }
}

const duplicateTitleMessage = "Question title already exists. Please enter new title!";
const duplicateDescriptionMessage = "Question description already exists. Please enter new description!"
  
const createQuestion = async (req, res) => {
    var { title, description, complexity, category, language } = req.body;
    title = title.trim();
    description = description.trim();
    category = category.trim();

    const smallCaseTitle = title.toLowerCase();
    const smallCaseDescription = description.toLowerCase();

    const response = {
      errors: {},
      question: null
    };

    const currentSameDescriptionQuestion =  await Question.findOne({ description: { $regex: new RegExp(`^${smallCaseDescription}$`, 'i') } });
    const currentSameTitleQuestion =  await Question.findOne({ title: { $regex: new RegExp(`^${smallCaseTitle}$`, 'i') } });

    if(currentSameDescriptionQuestion) {
      response.errors['duplicateDescription'] = duplicateDescriptionMessage;
    }
    if (currentSameTitleQuestion) {
      response.errors['duplicateTitle'] = duplicateTitleMessage;
    }  
    
    if(Object.keys(response.errors).length != 0) { 
      return res.status(400).json(response);
    } else {
      const question = new Question({_id: new mongoose.Types.ObjectId(), title, description, complexity, category, language,});
      response.question = await question.save();
      return res.status(200).json(response);
    }
}

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  let { title, description, complexity, category, language } = req.body;
  
  checkIdValidity(id);
  const question = await Question.findById(id);
  checkQuestionValidity(question);

  title = title.trim();
  description = description.trim();
    
  const smallCaseTitle = title.toLowerCase();
  const smallCaseDescription = description.toLowerCase();
    
  if (title !== question.title) {
    const currentSameTitleQuestion = await Question.findOne({ title: { $regex: new RegExp(`^${smallCaseTitle}$`, 'i') } });

    if (currentSameTitleQuestion) {
      return res.status(400).json({ error: 'Question with an identical title already exists.' });
    }
  }

  if (description !== question.description) {
    const currentSameDescriptionQuestion = await Question.findOne({ description: { $regex: new RegExp(`^${smallCaseDescription}$`, 'i') } });

    if (currentSameDescriptionQuestion) {
      return res.status(400).json({ error: 'Question with an identical description already exists.' });
    }
  }  

  try {
    question.title = title;
    question.description = description;
    question.complexity = complexity;
    question.category = category;
    question.language = language;
    const updatedQuestion = await question.save();
    res.status(200).json(updatedQuestion);
  } catch (error) {
    if (!title || !description || !complexity || !category || !language) {
      return res.status(400).json({ error: 'Missing fields are not allowed. Please fill all fields.' });
    }
    res.status(500).json({ error: 'Unable to update question' });
  }
}


const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    checkIdValidity(id);
    const question = await Question.findOneAndDelete({_id: id});
    checkQuestionValidity(question);
    res.status(200).json(question);
}

  module.exports = {
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion
  }
