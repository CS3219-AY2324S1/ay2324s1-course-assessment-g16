// A Class that stores and encapsulates Database Features

class QuestionDatabase {
    constructor() {
        this.database = new Map();
    }

    setDatabase(database) {
        this.database = database;
    }

    clearDatabase() {
        this.database = new Map();
    }

    addQuestion(questionToAdd) {
        if (!this.isDuplicateQuestion(questionToAdd, true)) {
            this.database.set(questionToAdd.id, questionToAdd);

            return true;
        }

        return false
    }

    deleteQuestion(questionId) {
        if (this.database.has(questionId)) {
            this.database.delete(questionId);

            return true;
        }

        return false;
    }

    updateQuestion(questionToUpdate) {
        if (!this.isDuplicateQuestion(questionToUpdate, false)) {
            this.database.set(questionToUpdate.id, questionToUpdate);
            return true;
        }

        return false;
    }

    getAllQuestions() {
        var questionList = [];

        for (const [key, value] of this.database) {
            questionList.push(value);
        }

        return questionList;
    }

    isDuplicateQuestion(questionToCheck, toCheckId) {
        // Ensure Unique ID when adding questions
        if (this.database.has(questionToCheck.id) && toCheckId) {
            return true;
        }

        var questionList = this.getAllQuestions();

        for (var i = 0; i < questionList.length; i++) {
            if (questionToCheck.id === questionList[i].id) {
                continue;
            }

            if (questionToCheck.title === questionList[i].title) {
                return true;
            }

            if (questionToCheck.description === questionList[i].description) {
                return true;
            }
        }

        return false;
    }

    toJSON() {
        return this.database;
    }
}

export default QuestionDatabase;
