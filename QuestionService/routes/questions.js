const express = require('express')
const { 
  createQuestion,
  getAllQuestions,
  getQuestion,
  getMatchQuestion,
  deleteQuestion,
  updateQuestion,
} = require('../controllers/questionController')
const router = express.Router()

// GET, POST, DELETE, UPDATE questions
router.get('/', getAllQuestions)
router.get('/:id', getQuestion) 
router.post('/', createQuestion)
router.post('/match', getMatchQuestion)
router.delete('/:id', deleteQuestion)
router.patch('/:id', updateQuestion)

module.exports = router