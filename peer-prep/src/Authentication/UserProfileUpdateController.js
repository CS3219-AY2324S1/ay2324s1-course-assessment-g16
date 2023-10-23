import { updateEmail, updatePassword, deleteUser } from "firebase/auth";

import { auth } from "./firebase";

async function updateUserName() {}

async function updateUserPreferredLanguage() {}

async function updateUserGithubId() {}

async function updateUserEmail(updatedUserEmail) {
  updateEmail(auth.currentUser, updatedUserEmail)
    .then(() => {
      console.log("User Email Updated Successfully");

      return true;
    })
    .catch((error) => {
      console.log("User Email Could Not Be Updated: " + error);

      return false;
    });
}

async function updateUserPassword(updatedUserPassword) {
  updatePassword(auth.currentUser, updatedUserPassword)
    .then(() => {
      console.log("User Password Updated Successfully");

      return true;
    })
    .catch((error) => {
      console.log("User Password Could Not Be Updated: " + error);

      return false;
    });
}

async function deleteUserAccount() {
  deleteUser(auth.currentUser)
    .then(() => {
      console.log("User Deleted Successfully");

      return true;
    })
    .catch((error) => {
      console.log("User Could Not Be Deleted: " + error);

      return false;
    });
}

export {
  updateUserName,
  updateUserPreferredLanguage,
  updateUserGithubId,
  updateUserEmail,
  updateUserPassword,
  deleteUserAccount,
};