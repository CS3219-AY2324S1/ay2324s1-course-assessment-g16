// Class that stores and encapsulates the Question and its related fields

class QuestionModel {
    constructor(id, title, description, complexity, category) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.complexity = complexity;
      this.category= category;
    }

    updateQuestionTitle(newQuestionTitle) {
        this.title = newQuestionTitle;
    }

    updateQuestionDescription(newQuestionDescription) {
        this.description = newQuestionDescription;
    }

    updateQuestionComplexity(newQuestionComplexity) {
        this.complexity = newQuestionComplexity;
    }

    updateQuestionCategory(newQuestionCategory) {
        this.category = newQuestionCategory;
    }
}
  
export default QuestionModel;
