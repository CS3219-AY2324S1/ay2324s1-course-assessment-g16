const mongoose = require('mongoose');

const Schema = mongoose.Schema

const questionSchema = new Schema({
  title: String,
  description: String,
  complexity: String,
  category: String,
});

module.exports =  mongoose.model('Question', questionSchema);;

