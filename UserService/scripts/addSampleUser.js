const mongoose = require("mongoose");

const User = require("../models/User");

// Password: minda42
const adminUser = new User({
  mongo_id: new mongoose.Types.ObjectId(),
  _id: "dI3FYrKCE4gX8KhhWQdG0C5UlDU2",
  name: "Jai",
  email: "admin@peerprep.com",
  githubId: "Jai2501",
  preferredLanguage: "C++",
  isAdmin: true,
});

// Password: elpmap24
const sampleUser = new User({
  mongo_id: new mongoose.Types.ObjectId(),
  _id: "0ZWYBwRK8xZI2Z2nHiKaGvr03NU2",
  name: "Sample Name",
  email: "sample@peerprep.com",
  githubId: "SampleGitHubID",
  preferredLanguage: "Java",
  isAdmin: false,
});

const addDemoUsersToDatabase = () => {
  User.findById(adminUser._id)
    .exec()
    .then((docs) => {
      if (docs === null) {
        adminUser.save().then((result) => {
          console.log("Added Admin User!");
        });
      } else {
        console.log("Admin Already Present!");
      }
    });

  User.findById(sampleUser._id)
    .exec()
    .then((docs) => {
      if (docs === null) {
        sampleUser.save().then((result) => {
          console.log("Added Sample User!");
        });
      } else {
        console.log("Sample Already Present!");
      }
    });

  return;
};

module.exports = {
  addDemoUsersToDatabase,
};
