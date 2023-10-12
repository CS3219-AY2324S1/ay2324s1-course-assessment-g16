const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "GET USERS",
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "POST USERS",
  });
});

router.get("/:userId", (req, res, next) => {
  const id = req.params.userId;

  res.status(200).json({
    message: "GET USER",
    userId: id,
  });
});

router.post("/:userId", (req, res, next) => {
  const id = req.params.userId;

  const user = {
    userId: id,
    name: req.body.name,
    email: req.body.email,
  };

  res.status(201).json({
    message: "POST USER",
    userData: user,
  });
});

router.delete("/:userId", (req, res, next) => {
  const id = req.params.userId;

  res.status(200).json({
    message: "DELETE USER",
    userId: id,
  });
});

module.exports = router;
