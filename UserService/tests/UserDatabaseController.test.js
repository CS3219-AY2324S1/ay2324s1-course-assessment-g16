const request = require("supertest");
const app = require("../app");

beforeAll(async () => {
  await request(app).delete("/users/sample_user_id");
});

afterAll(async () => {
  await request(app).delete("/users/sample_user_id");
});

test("Add a User: POST /users/:usedId", async () => {
  const result = await request(app).post("/users/sample_user_id").send({
    name: "Sample Name",
    email: "SampleEmail@gmail.com",
    githubId: "Sample_GitHub_Id",
    preferredLanguage: "C++",
  });

  expect(result.statusCode).toEqual(201);
  expect(result.body.user._id).toEqual("sample_user_id");
});

test("Get a Valid User: GET /users/:usedId", async () => {
  const result = await request(app).get("/users/sample_user_id");

  expect(result.statusCode).toEqual(200);
  expect(result.body.user._id).toEqual("sample_user_id");
  expect(result.body.user.name).toEqual("Sample Name");
});

test("Get a Non-existent User: GET /users/:usedId", async () => {
  const result = await request(app).get("/users/sample_user_id_random");

  expect(result.statusCode).toEqual(404);
});

test("Get All Users: GET /users/", async () => {
  const result = await request(app).get("/users/");

  expect(result.statusCode).toEqual(200);

  expect(result.body.users.length).not.toEqual(0);
});

test("Make a Valid User Admin: PATCH /users/update-privilege", async () => {
  const _ = await request(app).patch("/users/update-privilege").send({
    email: "SampleEmail@gmail.com",
    isAdmin: true,
  });

  const result = await request(app).get("/users/sample_user_id");

  expect(result.statusCode).toEqual(200);
  expect(result.body.user._id).toEqual("sample_user_id");
  expect(result.body.user.name).toEqual("Sample Name");
  expect(result.body.user.isAdmin).toEqual(true);
});

test("Make a Non-existent User Admin: PATCH /users/update-privilege", async () => {
  const result = await request(app).patch("/users/update-privilege").send({
    email: "non-existant@gmail.com",
    isAdmin: true,
  });

  expect(result.statusCode).toEqual(404);
});

test("Update a Valid User Data: PATCH /users/:userId", async () => {
  const _ = await request(app).patch("/users/sample_user_id").send({
    name: "New Name",
    email: "SampleEmail@gmail.com",
    githubId: "New GitHub ID",
    preferredLanguage: "Python",
  });

  const result = await request(app).get("/users/sample_user_id");

  expect(result.statusCode).toEqual(200);
  expect(result.body.user._id).toEqual("sample_user_id");
  expect(result.body.user.name).toEqual("New Name");
  expect(result.body.user.email).toEqual("SampleEmail@gmail.com");
  expect(result.body.user.githubId).toEqual("New GitHub ID");
  expect(result.body.user.preferredLanguage).toEqual("Python");
});

test("Update a Non-existant User Data: PATCH /users/:userId", async () => {
  const result = await request(app).patch("/users/non-existent").send({
    name: "New Name",
    email: "SampleEmail@gmail.com",
    githubId: "New GitHub ID",
    preferredLanguage: "Python",
  });

  expect(result.statusCode).toEqual(404);
});

test("Delete a Non-existant User Data: PATCH /users/:userId", async () => {
  const result = await request(app).delete("/users/non-existent");

  expect(result.statusCode).toEqual(404);
});

test("Delete a Valid User Data: PATCH /users/:userId", async () => {
  const result = await request(app).delete("/users/sample_user_id");

  expect(result.statusCode).toEqual(200);
  expect(result.body.userId).toEqual("sample_user_id");

  const result_after_delete = await request(app).get("/users/sample_user_id");

  expect(result_after_delete.statusCode).toEqual(404);
});

test("Invalid Route: GET /", async () => {
  const result = await request(app).delete("/");

  expect(result.statusCode).toEqual(404);
  expect(result.body.error.message).toEqual("Route Not Found");
});
