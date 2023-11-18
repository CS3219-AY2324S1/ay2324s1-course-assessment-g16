// Class that stores and encapsulates the Question and its related fields

class QuestionModel {
  static QUESTION_FIELDS = {
    ID: "Id",
    TITLE: "Title",
    DESCRIPTION: "Description",
    COMPLEXITY: "Complexity",
    CATEGORY: "Category",
  };

  static ERROR_MESSAGE = " Is Empty";

  constructor(id, title, description, complexity, category) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.complexity = complexity;
    this.category = category;
  }

  isQuestionValid() {
    let errors = [];

    for (const qField in QuestionModel.QUESTION_FIELDS) {
      const fieldName = QuestionModel.QUESTION_FIELDS[qField].toLowerCase();

      if (
        (typeof this[fieldName] === "string" &&
          this[fieldName].trim() === "") ||
        !this[fieldName]
      ) {
        errors.push(
          QuestionModel.QUESTION_FIELDS[qField] + QuestionModel.ERROR_MESSAGE
        );
      }
    }

    return errors;
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

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      complexity: this.complexity,
      category: this.category,
    };
  }
}

export default QuestionModel;
