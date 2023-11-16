import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
 } from "firebase/auth";
 
 import {auth} from "./firebase";
 
 import setFirebaseUserCredentials from "./AuthenticationState";
 
 import {setLocalUserState} from "../User/UserStateController";
 
 var unsubscribeAuthenticationStateObserver = null;
 
 var errorMap = {
  "auth/weak-password": "Password should be atleast 6 characters!",
  "auth/invalid-email": "Please enter valid email!",
 };
 async function registerUserUsingFirebase(userEmail, userPassword) {
  var res = {
   success: false,
   message: "",
  };
 
  try {
   const userCredential = await createUserWithEmailAndPassword(
    auth,
    userEmail,
    userPassword
   );
 
   console.log("User Created Successfully: " + userCredential.user);
   res.success = true;
   return res;
  } catch (error) {
   // Error
   console.log("User Creation Unsuccessful: " + error);
   res.success = false;
   res.message = errorMap[error["code"]];
   return res;
  }
 }
 
 async function loginUserUsingFirebase(userEmail, userPassword) {
  try {
   const userCredential = await signInWithEmailAndPassword(
    auth,
    userEmail,
    userPassword
   );
 
   console.log("User Logged In Successfully: " + userCredential.user);
 
   return true;
  } catch (error) {
   console.log("User Login Unsuccessful: " + error);
 
   // Invalid Email/Password
   return false;
  }
 }
 
 async function logoutUserUsingFirebase() {
  try {
   await signOut(auth);
 
   console.log("Signout Successful");
 
   return true;
  } catch (error) {
   console.log("Could Not Signout: " + error);
 
   return false;
  }
 }
 
 async function resetUserPasswordUsingFirebase(userEmail) {
  try {
   await sendPasswordResetEmail(auth, userEmail);
 
   console.log("Password Reset Email Sent Successfully");
 
   return true;
  } catch (error) {
   console.log("Could Not Send Password Reset Email : " + error);
 
   return false;
  }
 }
 
 async function isUserLoggedInUsingFirebase() {
  return new Promise((resolve, reject) => {
   const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe(); // Stop listening to further changes
    if (user) {
     resolve(true); // User is logged in
    } else {
     resolve(false); // User is not logged in
    }
   });
  });
 }
 
 function observeAuthState() {
  if (unsubscribeAuthenticationStateObserver !== null) {
   unsubscribeAuthenticationStateObserver();
  }
 
  unsubscribeAuthenticationStateObserver = onAuthStateChanged(
   auth,
   async (user) => {
    setFirebaseUserCredentials(user);
 
    // Possible to add setUserState Here (Issue: Higher Coupling)
    await setLocalUserState(user);
   }
  );
 }
 
 observeAuthState();
 
 export {
  registerUserUsingFirebase,
  loginUserUsingFirebase,
  logoutUserUsingFirebase,
  resetUserPasswordUsingFirebase,
  isUserLoggedInUsingFirebase,
 };