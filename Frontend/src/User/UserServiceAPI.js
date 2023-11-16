// Provides APIs to Frontend

import {
	registerUserUsingFirebase,
	loginUserUsingFirebase,
	logoutUserUsingFirebase,
	resetUserPasswordUsingFirebase,
} from "../Authentication/UserAuthenticationController";

import {
	updateUserEmailInFirebase,
	deleteUserAccountInFirebase,
	updateUserPasswordInFirebase,
} from "../Authentication/UserProfileUpdateController";

import {
	getUserData,
	postUserData,
	patchUserData,
	deleteUserData,
	updateUserPrivilege,
	getAllUsersData,
} from "./UserServiceClientController";

import {getFirebaseUserCredentials} from "../Authentication/AuthenticationState";

import {updateUserState, setUserState, isUserAdmin} from "./UserState";

async function registerUser(
	userName,
	userEmail,
	userPassword,
	userGithubId,
	userPreferredLanguage
) {
	const isFirebaseUserRegistrationSuccessful = await registerUserUsingFirebase(
		userEmail,
		userPassword
	);

	if (isFirebaseUserRegistrationSuccessful.success) {
		const userId = getFirebaseUserCredentials().uid;
		const result = await postUserData(
			userId,
			userName,
			userEmail,
			userGithubId,
			userPreferredLanguage
		);

		if (result !== null && result.status === 201) {
			setUserState(result.data.user);

			return isFirebaseUserRegistrationSuccessful;
		}

		// Firebase Account Created, But Could Not Be Stored In User Service Database
		await deleteUserAccountInFirebase();
	}

	isFirebaseUserRegistrationSuccessful.success = false;
	return isFirebaseUserRegistrationSuccessful;
}

async function loginUser(userEmail, userPassword) {
	const isFirebaseUserLoginSuccessful = await loginUserUsingFirebase(
		userEmail,
		userPassword
	);

	if (isFirebaseUserLoginSuccessful) {
		const userId = getFirebaseUserCredentials().uid;
		const result = await getUserData(userId);

		if (result !== null && result.status === 200) {
			setUserState(result.data.user);

			return true;
		}

		// User Logged In, But User Data Could Not Be Obtained From User Service
		await logoutUser();
	}

	return false;
}

async function logoutUser() {
	const result = await logoutUserUsingFirebase();

	if (result === true) {
		setUserState(null);
	}

	return result;
}

async function resetUserPassword(userEmail) {
	const result = await resetUserPasswordUsingFirebase(userEmail);

	return result;
}

async function deleteUser() {
	if (getFirebaseUserCredentials() !== null) {
		const result = await deleteUserData(getFirebaseUserCredentials().uid);

		if (result !== null && result.status === 200) {
			const isDeletedFromFirebase = await deleteUserAccountInFirebase();

			if (isDeletedFromFirebase) {
				setUserState(null);

				return true;
			}
		}
	}

	return false;
}

async function updateUserData(
	updatedUserName,
	updatedUserEmail,
	updatedUserGithubId,
	updatedUserPreferredLanguage
) {
	const currentEmailId = getFirebaseUserCredentials().email;
	const isEmailIdUpdated = currentEmailId !== updatedUserEmail;

	if (isEmailIdUpdated) {
		const result = await updateUserEmailInFirebase(updatedUserEmail);

		if (result === false) {
			return false;
		}
	}

	const result = await patchUserData(
		getFirebaseUserCredentials().uid,
		updatedUserName,
		updatedUserEmail,
		updatedUserGithubId,
		updatedUserPreferredLanguage
	);

	if (result !== null && result.status === 200) {
		// Update User State
		updateUserState(
			updatedUserName,
			updatedUserEmail,
			updatedUserGithubId,
			updatedUserPreferredLanguage
		);

		return true;
	}

	// Reset Updated Email
	await updateUserEmailInFirebase(currentEmailId);
	return false;
}

async function updateLoggedInUserPassword(updatedUserPassword) {
	const result = await updateUserPasswordInFirebase(updatedUserPassword);

	return result;
}

async function elevateUserPrivilege(userEmailToElevate) {
	if ((await isUserAdmin()) === true) {
		const result = await updateUserPrivilege(userEmailToElevate, true);

		if (result !== null && result.status === 200) {
			return true;
		}
	}

	return false;
}

async function lowerUserPrivilege(userEmailToLower) {
	if ((await isUserAdmin()) === true) {
		const result = await updateUserPrivilege(userEmailToLower, false);

		if (result !== null && result.status === 200) {
			return true;
		}
	}

	return false;
}

async function getAllRegisteredUsers() {
	if ((await isUserAdmin()) === true) {
		const result = await getAllUsersData();

		if (result !== null && result.status === 200) {
			return result.data.users;
		}
	}

	return null;
}

export {
	registerUser,
	loginUser,
	logoutUser,
	resetUserPassword,
	deleteUser,
	updateUserData,
	updateLoggedInUserPassword,
	elevateUserPrivilege,
	lowerUserPrivilege,
	getAllRegisteredUsers,
};