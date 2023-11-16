const mongoose = require("mongoose");

const lineInputSchema = new mongoose.Schema({
	line: Number,
	code: String,
	lastModifier: String,
});

const collaborativeInputSchema = new mongoose.Schema({
	sessionId: String,
	initTime: Number,
	language: String,
	codes: [lineInputSchema],
});

const CollaborativeInput = mongoose.model(
	"CollaborativeInput",
	collaborativeInputSchema
);
const LineInput = mongoose.model("LineInput", lineInputSchema);

module.exports = {
	LineInput,
	CollaborativeInput,
};
