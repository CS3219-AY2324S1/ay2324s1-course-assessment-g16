const mongoose = require("mongoose");

const User = require("../models/User");

const getAllUsers = (req, res, next) => {
  User.find()
    .exec()
    .then((docs) => {
      console.log("Got All Users: " + docs);

      res.status(200).json({
        message: "GET ALL USERS",
        users: docs,
      });
    })
    .catch((error) => {
      console.log("Error: " + error);

      res.status(500).json({
        message: "GET ALL USERS",
        error: error,
      });
    });
};

const getUserById = (req, res, next) => {
  const id = req.params.userId;

  User.findById(id)
    .exec()
    .then((docs) => {
      if (docs === null) {
        console.log("Get User: " + id + ", User does not exist");

        res.status(404).json({
          message: "GET USER: NOT FOUND",
          user: docs,
        });

        return;
      }

      console.log("Get User: " + id + ", " + docs);

      res.status(200).json({
        message: "GET USER",
        user: docs,
      });
    })
    .catch((error) => {
      console.log("Error: " + error);

      res.status(500).json({
        message: "GET USER",
        error: error,
      });
    });
};

const addUserToDatabase = (req, res, next) => {
  const id = req.params.userId;

  const user = new User({
    mongo_id: new mongoose.Types.ObjectId(),
    _id: id,
    name: req.body.name,
    email: req.body.email,
    githubId: req.body.githubId,
    preferredLanguage: req.body.preferredLanguage,
    isAdmin: false,
  });

  user
    .save()
    .then((result) => {
      console.log("Saved User: " + id);

      res.status(201).json({
        message: "POST USER",
        user: user,
      });
    })
    .catch((error) => {
      console.log("Unable to save User: " + id);

      res.status(500).json({
        message: "POST USER",
        error: error,
      });
    });
};

const updateUserData = (req, res, next) => {
  const id = req.params.userId;

  User.updateOne(
    { _id: id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        githubId: req.body.githubId,
        preferredLanguage: req.body.preferredLanguage,
      },
    }
  )
    .exec()
    .then((docs) => {
      if (docs.modifiedCount === 0) {
        console.log("PATCH USER NOT FOUND");

        res.status(404).json({
          message: "PATCH USER: NOT FOUND",
          status: docs,
        });

        return;
      }

      console.log("PATCH USER: " + id);

      res.status(200).json({
        message: "PATCH USER",
        status: docs,
      });
    })
    .catch((error) => {
      console.log("Unable to PATCH User: " + id);

      res.status(500).json({
        message: "PATCH USER",
        error: error,
      });
    });
};

const deleteUserFromDatabase = (req, res, next) => {
  const id = req.params.userId;

  User.deleteOne({ _id: id })
    .exec()
    .then((docs) => {
      if (docs.deletedCount === 0) {
        console.log("USER TO DELETE NOT FOUND");

        res.status(404).json({
          message: "DELETE USER: NOT FOUND",
          status: docs,
        });
        return;
      }
      console.log("Deleted User: " + id);

      res.status(200).json({
        message: "DELETED USER",
        userId: id,
        docs: docs,
      });
    })
    .catch((error) => {
      console.log("Error: " + error);

      res.status(500).json({
        message: "DELETE USER",
        error: error,
      });
    });
};

const updateUserPrivilege = (req, res, next) => {
  User.updateOne(
    { email: req.body.email },
    {
      $set: {
        isAdmin: req.body.isAdmin,
      },
    }
  )
    .exec()
    .then((docs) => {
      if (docs.matchedCount === 0) {
        console.log("PRIVILEGE UPDATE: USER NOT FOUND: " + req.body.email);

        res.status(404).json({
          message: "PRIVILEGE UPDATE: USER NOT FOUND",
          status: docs,
        });

        return;
      }

      console.log("PRIVILEGE UPDATE USER: " + req.body.email);

      res.status(200).json({
        message: "PRIVILEGE UPDATE USER",
        status: docs,
      });
    })
    .catch((error) => {
      console.log("Unable to PRIVILEGE UPDATE User: " + req.body.email);

      res.status(500).json({
        message: "PRIVILEGE UPDATE USER",
        error: error,
      });
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  addUserToDatabase,
  updateUserData,
  deleteUserFromDatabase,
  updateUserPrivilege,
};
