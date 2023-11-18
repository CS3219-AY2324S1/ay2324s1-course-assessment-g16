const {
  getUserData,
  postUserData,
  patchUserData,
  deleteUserData,
  updateUserPrivilege,
  getAllUsersData,
} = require("../UserServiceClientController");

test("Post User Data", () => {
  return postUserData(
    "test_id",
    "Test Name",
    "test@gmail.com",
    "test_github_id",
    "test_language"
  ).then((result) => {
    expect(result.status).toBe(201);
  });
});

test("Get User Data", () => {
  return getUserData("test_id").then((result) => {
    expect(result.status).toBe(200);
  });
});

test("Patch User Data", () => {
  return patchUserData(
    "test_id",
    "Test Name 1",
    "test1@gmail.com",
    "test_github_id1",
    "test_language1"
  ).then((result) => {
    expect(result.status).toBe(200);
  });
});

test("Update Privilege Of User", () => {
  return updateUserPrivilege("test1@gmail.com", true).then((result) => {
    expect(result.status).toBe(200);
  });
});

test("Delete User Data", () => {
  return deleteUserData("test_id").then((result) => {
    expect(result.status).toBe(200);
  });
});

test("Get All Users", () => {
  return getAllUsersData().then((result) => {
    expect(result.status).toBe(200);
  });
});
