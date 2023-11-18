import axios from "axios";
import { HISTORY_SERVICE_HOST } from "./config";

async function getUserAttemptsFromHistoryDatabase(userId) {
  try {
    const result = await axios.get(HISTORY_SERVICE_HOST + "history/" + userId);

    return result;
  } catch (error) {
    console.log("Error: " + error);

    return null;
  }
}

async function addUserAttemptToHistoryDatabase(
  userId1,
  userId2,
  sessionId,
  questionId,
  questionTitle,
  questionDescription,
  questionCategory,
  questionComplexity
) {
  try {
    const result = await axios.post(
      HISTORY_SERVICE_HOST + "history/add-attempt",
      {
        userId1: userId1,
        userId2: userId2,
        sessionId: sessionId,
        questionId: questionId,
        questionTitle: questionTitle,
        questionDescription: questionDescription,
        questionCategory: questionCategory,
        questionComplexity: questionComplexity,
      }
    );

    return result;
  } catch (error) {
    console.log("Error: " + error);

    return null;
  }
}

export { getUserAttemptsFromHistoryDatabase, addUserAttemptToHistoryDatabase };
