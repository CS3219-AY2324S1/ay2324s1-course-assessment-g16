// Interface Between User Service and Client

import axios from "axios";
// const axios = require("axios").default; // Supports Testing

const USER_SERVICE_HOST = "http://localhost:3002/";

async function getUserData(userId) {
  try {
    const result = await axios.get(USER_SERVICE_HOST + "users/" + userId);

    return result;
  } catch (error) {
    console.log("Error" + error);

    return null;
  }
}

async function postUserData(
  userId,
  userName,
  userEmail,
  userGithubId,
  userPreferredLanguage
) {
  try {
    const result = await axios.post(USER_SERVICE_HOST + "users/" + userId, {
      name: userName,
      email: userEmail,
      githubId: userGithubId,
      preferredLanguage: userPreferredLanguage,
    });

    return result;
  } catch (error) {
    console.log("Error" + error);

    return null;
  }
}

async function patchUserData(
  userId,
  userName,
  userEmail,
  userGithubId,
  userPreferredLanguage
) {
  try {
    const result = await axios.patch(USER_SERVICE_HOST + "users/" + userId, {
      name: userName,
      email: userEmail,
      githubId: userGithubId,
      preferredLanguage: userPreferredLanguage,
    });

    return result;
  } catch (error) {
    console.log("Error" + error);

    return null;
  }
}

async function deleteUserData(userId) {
  try {
    const result = await axios.delete(USER_SERVICE_HOST + "users/" + userId);

    return result;
  } catch (error) {
    console.log("Error" + error);

    return null;
  }
}

async function updateUserPrivilege(userEmail, adminStatus) {
  try {
    const result = await axios.patch(
      USER_SERVICE_HOST + "users/update-privilege",
      {
        email: userEmail,
        isAdmin: adminStatus,
      }
    );

    return result;
  } catch (error) {
    console.log("Error" + error);

    return null;
  }
}

async function getAllUsersData() {
  try {
    const result = await axios.get(USER_SERVICE_HOST + "users");

    return result;
  } catch (error) {
    console.log("Error" + error);

    return null;
  }
}

export {
  getUserData,
  postUserData,
  patchUserData,
  deleteUserData,
  updateUserPrivilege,
  getAllUsersData,
};
