const mongoose = require('mongoose');

const Schema = mongoose.Schema

const questionSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {type: String, required: true},
  description: {type: String, required: true},
  complexity: {type: String, required: true},
  category: {type: String, required: true},
  language:{type: String, required: true},
});

module.exports = mongoose.model('Question', questionSchema);

