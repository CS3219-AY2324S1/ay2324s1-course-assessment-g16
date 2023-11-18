import QuestionDatabase from "../DataModel/QuestionDatabase";

function updateLocalQuestionDatabase(updatedDatabase) {
    const data = JSON.stringify(Array.from(updatedDatabase.database.entries()));
    localStorage.setItem("questions", data);
}

function retrieveQuestionDatabase() {
    let questionDatabase = new QuestionDatabase();

    questionDatabase.setDatabase(new Map(JSON.parse(localStorage.getItem("questions"))))
    return questionDatabase;
}

function setupQuestionDatabase() {
    var data = localStorage.getItem("questions");

    if(!data) {
        localStorage.setItem("questions", JSON.stringify([]))
    };
}

export { setupQuestionDatabase, retrieveQuestionDatabase, updateLocalQuestionDatabase };
