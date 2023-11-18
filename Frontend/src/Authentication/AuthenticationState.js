// Stores the Authentication State

import { isUserLoggedInUsingFirebase } from "./UserAuthenticationController";

var firebaseUserCredentials = null;

function setFirebaseUserCredentials(obtainedUser) {
  firebaseUserCredentials = obtainedUser;
}

function getFirebaseUserCredentials() {
  return firebaseUserCredentials;
}

async function isUserLoggedIn() {
  return await isUserLoggedInUsingFirebase();
}

export { getFirebaseUserCredentials, isUserLoggedIn };

export default setFirebaseUserCredentials;
