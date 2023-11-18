// Stores the User State

import UserModel from "../DataModel/UserModel";
import { getUserAdminStatus } from "./UserStateController";

var currentLoggedInUser = null;

function setUserState(obtainedUser) {
  if (obtainedUser === null) {
    currentLoggedInUser = null;

    return;
  }

  currentLoggedInUser = new UserModel("", "", "");
  currentLoggedInUser.updateUser(obtainedUser);

  console.log("User State Set");
}

function updateUserState(
  updatedUserName,
  updatedUserEmail,
  updatedUserGithubId,
  updatedUserPreferredLanguage
) {
  if (currentLoggedInUser === null) {
    return;
  }

  currentLoggedInUser.updateName(updatedUserName);
  currentLoggedInUser.updateEmail(updatedUserEmail);
  currentLoggedInUser.updateGithubId(updatedUserGithubId);
  currentLoggedInUser.updatePreferredLanguage(updatedUserPreferredLanguage);
}

function getUserId() {
  if (currentLoggedInUser) {
    return currentLoggedInUser.id;
  }

  return null;
}

function getUserName() {
  if (currentLoggedInUser) {
    return currentLoggedInUser.name;
  }

  return null;
}

function getUserEmail() {
  if (currentLoggedInUser) {
    return currentLoggedInUser.email;
  }

  return null;
}

function getUserPreferredLanguage() {
  if (currentLoggedInUser) {
    return currentLoggedInUser.preferredLanguage;
  }

  return null;
}

function getUserGithubId() {
  if (currentLoggedInUser) {
    return currentLoggedInUser.githubId;
  }

  return null;
}

async function isUserAdmin() {
  return await getUserAdminStatus();
}

export {
  getUserId,
  getUserName,
  getUserEmail,
  getUserPreferredLanguage,
  getUserGithubId,
  isUserAdmin,
  setUserState,
  updateUserState,
};
