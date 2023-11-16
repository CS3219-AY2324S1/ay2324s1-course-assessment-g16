const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  addUserToDatabase,
  updateUserData,
  deleteUserFromDatabase,
  updateUserPrivilege,
} = require("../controllers/UserDatabaseController");

router.get("/", getAllUsers);

router.patch("/update-privilege", updateUserPrivilege);

router.get("/:userId", getUserById);

router.post("/:userId", addUserToDatabase);

router.patch("/:userId", updateUserData);

router.delete("/:userId", deleteUserFromDatabase);

module.exports = router;
