const Question = require("../models/questionModel");
const mongoose = require("mongoose");

const checkIdValidity = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(500).json({ error: "Invalid question ID" });
  }
};

const checkQuestionValidity = (question) => {
  if (!question) {
    res.status(500).json({ error: "Question not found" });
  }
};

const getMatchQuestion = async (req, res) => {
  console.log("get question with properties: ", req.body);

  const language = req.body.language;
  const difficulty = req.body.difficulty;
  const category = req.body.category;

  let aggregationPipeline = [];
  let actualLanguage = "";
  if (language !== "None") {
    if (language === "SQL") {
      actualLanguage = "SQL";
    } else {
      actualLanguage = language;
    }
    aggregationPipeline.push({ $match: { language: actualLanguage } });
  }

  if (difficulty !== "None") {
    aggregationPipeline.push({ $match: { complexity: difficulty } });
  }

  if (category !== "None") {
    aggregationPipeline.push({ $match: { category: category } });
  }

  aggregationPipeline.push({ $sample: { size: 1 } });

  let question = await Question.aggregate(aggregationPipeline);

  question = question[0];

  if (!question) {
    question = null;
  }

  console.log("get", question);

  const response = {
    question: question,
    request: req.body,
  };

  return res.status(200).json(response);
};

const getQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findOne({ _id: questionId });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    const response = {
      questionId: questionId,
      question: question,
    };
    console.log("Identified a question:", response);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

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
    res.status(500).json({ error: "Error retrieving questions" });
  }
};

const duplicateTitleMessage =
  "Question title already exists. Please enter new title!";
const duplicateDescriptionMessage =
  "Question description already exists. Please enter new description!";

const createQuestion = async (req, res) => {
  var { title, description, complexity, category, language } = req.body;
  title = title.trim();
  description = description.trim();
  category = category.trim();

  const smallCaseTitle = title.toLowerCase();
  const smallCaseDescription = description.toLowerCase();

  const response = {
    errors: {},
    question: null,
  };

  const currentSameDescriptionQuestion = await Question.findOne({
    description: { $regex: new RegExp(`^${smallCaseDescription}$`, "i") },
  });
  const currentSameTitleQuestion = await Question.findOne({
    title: { $regex: new RegExp(`^${smallCaseTitle}$`, "i") },
  });

  if (currentSameDescriptionQuestion) {
    response.errors["duplicateDescription"] = duplicateDescriptionMessage;
  }
  if (currentSameTitleQuestion) {
    response.errors["duplicateTitle"] = duplicateTitleMessage;
  }

  if (Object.keys(response.errors).length != 0) {
    return res.status(400).json(response);
  } else {
    const question = new Question({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      complexity,
      category,
      language,
    });
    response.question = await question.save();
    return res.status(200).json(response);
  }
};

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  let { title, description, complexity, category, language } = req.body;

  checkIdValidity(id);
  const question = await Question.findById(id);
  // checkQuestionValidity(question);

  title = title.trim();
  description = description.trim();

  const smallCaseTitle = title.toLowerCase();
  const smallCaseDescription = description.toLowerCase();

  if (title !== question.title) {
    const currentSameTitleQuestion = await Question.findOne({
      title: { $regex: new RegExp(`^${smallCaseTitle}$`, "i") },
    });

    if (currentSameTitleQuestion) {
      return res
        .status(400)
        .json({ error: "Question with an identical title already exists." });
    }
  }

  if (description !== question.description) {
    const currentSameDescriptionQuestion = await Question.findOne({
      description: { $regex: new RegExp(`^${smallCaseDescription}$`, "i") },
    });

    if (currentSameDescriptionQuestion) {
      return res
        .status(400)
        .json({
          error: "Question with an identical description already exists.",
        });
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
      return res
        .status(400)
        .json({
          error: "Missing fields are not allowed. Please fill all fields.",
        });
    }
    res.status(500).json({ error: "Unable to update question" });
  }
};

const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  checkIdValidity(id);
  const question = await Question.findOneAndDelete({ _id: id });
  checkQuestionValidity(question);
  res.status(200).json(question);
};

const addUserTag = async (req, res) => {
  const { id } = req.params;
  const { userId, tag } = req.body;

  try {
    checkIdValidity(id);
    const question = await Question.findById(id);
    checkQuestionValidity(question);

    const userIndex = question.userTags.findIndex(
      (value) => value.userId === userId
    );

    if (userIndex != -1) {
      question.userTags[userIndex].tags.push(tag);
    } else {
      question.userTags.push({ userId, tags: [tag] });
    }

    const modifiedQuestion = await question.save();
    res.status(200).json(modifiedQuestion);
  } catch (error) {
    res.status(500).json({ error: "Unable to add tag" });
  }
};

const deleteUserTag = async (req, res) => {
  const { id } = req.params;
  const { userId, tag } = req.body;

  try {
    checkIdValidity(id);
    const question = await Question.findById(id);
    checkQuestionValidity(question);

    const userIndex = question.userTags.findIndex(
      (value) => value.userId === userId
    );

    if (userIndex == -1) {
      res.status(400).json({ error: "Error with finding user for question" });
    } else {
      const tagIndex = question.userTags[userIndex].tags.indexOf(tag);
      if (tagIndex == -1) {
        res.status(400).json({ error: "Error with finding tag for user" });
      } else {
        question.userTags[userIndex].tags.splice(tagIndex, 1);
        const updatedQuestion = await question.save();
        res.status(200).json(updatedQuestion);
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to delete tag" });
  }
};

module.exports = {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  addUserTag,
  deleteUserTag,
  getMatchQuestion,
  getQuestion,
  duplicateTitleMessage,
  duplicateDescriptionMessage
};
