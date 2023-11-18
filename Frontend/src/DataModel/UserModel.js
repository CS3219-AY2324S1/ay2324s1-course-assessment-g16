// Class that stores and encapsulates User Info
// Matches that of the one in UserService

class UserModel {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;

    this.isAdmin = false;
    this.preferredLanguage = null;
    this.githubId = null;
  }

  updateName(newName) {
    this.name = newName;
  }

  updateEmail(newEmail) {
    this.email = newEmail;
  }

  updateAdminStatus(newAdminStatus) {
    this.isAdmin = newAdminStatus;
  }

  updatePreferredLanguage(newPreferredLanguage) {
    this.preferredLanguage = newPreferredLanguage;
  }

  updateGithubId(newGithubId) {
    this.githubId = newGithubId;
  }

  updateUser(userDetails) {
    this.id = userDetails._id;
    this.name = userDetails.name;
    this.email = userDetails.email;
    this.githubId = userDetails.githubId;
    this.isAdmin = userDetails.isAdmin;
    this.preferredLanguage = userDetails.preferredLanguage;
  }

  toJSON() {
    return {
      _id: this.id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
      preferredLanguage: this.preferredLanguage,
      githubId: this.githubId,
    };
  }
}

export default UserModel;
