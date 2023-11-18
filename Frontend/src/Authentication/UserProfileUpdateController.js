import { updateEmail, updatePassword, deleteUser } from "firebase/auth";

import { auth } from "./firebase";

/**
 * BUG ALERT: https://stackoverflow.com/questions/77147854/firebase-please-verify-the-new-email-before-changing-email-auth-operation-not
 * !! This function should not be used until a workaround from Firebase is provided
 * !! or User Email Update Field can be disabled while editing
 *
 * Updates the Email of the currently logged in User on Firebase Authentication Service.
 *
 * @param {String} updatedUserEmail
 * @returns Promise<Boolean> True, if the email change operation was successful. False otherwise.
 */
async function updateUserEmailInFirebase(updatedUserEmail) {
  try {
    await updateEmail(auth.currentUser, updatedUserEmail);

    console.log("User Email Updated Successfully");

    return true;
  } catch (error) {
    console.log("User Email Could Not Be Updated: " + error);

    return false;
  }
}

async function updateUserPasswordInFirebase(updatedUserPassword) {
  try {
    await updatePassword(auth.currentUser, updatedUserPassword);

    console.log("User Password Updated Successfully");

    return true;
  } catch (error) {
    console.log("User Password Could Not Be Updated: " + error);

    return false;
  }
}

async function deleteUserAccountInFirebase() {
  try {
    await deleteUser(auth.currentUser);

    console.log("User Deleted Successfully");

    return true;
  } catch (error) {
    console.log("User Could Not Be Deleted: " + error);

    return false;
  }
}

export {
  updateUserEmailInFirebase,
  updateUserPasswordInFirebase,
  deleteUserAccountInFirebase,
};
