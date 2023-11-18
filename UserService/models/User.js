const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  mongo_id: mongoose.Schema.Types.ObjectId,
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  githubId: { type: String, required: true },
  preferredLanguage: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", userSchema);
