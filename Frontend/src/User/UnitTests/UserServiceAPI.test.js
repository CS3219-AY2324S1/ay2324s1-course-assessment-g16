const {
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
} = require("../UserServiceAPI");

const {
  getUserId,
  getUserName,
  getUserEmail,
  getUserPreferredLanguage,
  getUserGithubId,
  isUserAdmin,
} = require("../UserState");

const {
  getFirebaseUserCredentials,
  isUserLoggedIn,
} = require("../../Authentication/AuthenticationState");

afterAll(async () => {
  await deleteUser();
});

test("Test User Registration Flow", async () => {
  return registerUser(
    "Test Name",
    "test@yahoo.com",
    "Password123",
    "TestGitHubId",
    "TestLanguage"
  ).then(async (data) => {
    expect(data.success).toBe(true);

    expect(await isUserLoggedIn()).toBe(true);
    expect(getUserName()).toBe("Test Name");

    expect(getFirebaseUserCredentials).not.toBe(null);
  });
});

test("Test User Logout Flow", async () => {
  return logoutUser().then((data) => {
    expect(data).toBe(true);
  });
});

test("Test User Login Flow", async () => {
  return loginUser("test@yahoo.com", "Password123").then(async (data) => {
    expect(data).toBe(true);

    expect(getUserName()).toBe("Test Name");
    expect(getUserEmail()).toBe("test@yahoo.com");
    expect(getUserPreferredLanguage()).toBe("TestLanguage");
    expect(getUserGithubId()).toBe("TestGitHubId");
    expect(await isUserAdmin()).toBe(false);
  });
});

test("Test User Data Update Flow", async () => {
  return updateUserData(
    "Updated Name",
    "test@yahoo.com",
    "UpdatedGitHubId",
    "UpdatedTestLanguage"
  ).then(async (data) => {
    expect(data).toBe(true);

    expect(getUserName()).toBe("Updated Name");
    expect(getUserEmail()).toBe("test@yahoo.com");
    expect(getUserPreferredLanguage()).toBe("UpdatedTestLanguage");
    expect(getUserGithubId()).toBe("UpdatedGitHubId");
    expect(await isUserAdmin()).toBe(false);
  });
});
