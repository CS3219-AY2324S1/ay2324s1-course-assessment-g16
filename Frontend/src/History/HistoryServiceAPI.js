import {
  getUserAttemptsFromHistoryDatabase,
  addUserAttemptToHistoryDatabase,
} from "./HistoryServiceController";

async function getUserAttempts(userId) {
  const result = await getUserAttemptsFromHistoryDatabase(userId);
  console.log(result);
  if (result !== null && result.status === 200) {
    return result.data.result;
  }

  return null;
}

async function addUserAttempt(
  userId1,
  userId2,
  sessionId,
  questionId,
  questionTitle,
  questionDescription,
  questionCategory,
  questionComplexity
) {
  const result = await addUserAttemptToHistoryDatabase(
    userId1,
    userId2,
    sessionId,
    questionId,
    questionTitle,
    questionDescription,
    questionCategory,
    questionComplexity
  );

  if (result !== null && result.status === 201) {
    return true;
  }

  return false;
}

export { addUserAttempt, getUserAttempts };
