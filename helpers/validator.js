class validator {
  static validateUserInfo(userDetails, users) {
    if (userDetails.hasOwnProperty("username") &&
      userDetails.hasOwnProperty("email") &&
      userDetails.hasOwnProperty("password") &&
      userDetails.hasOwnProperty("newsPreferencesCategories") &&
      this.validateEmail(userDetails) &&
      this.validateUniqueEmail(userDetails, users)) {
      return {
        "status": true,
        "message": "User has been register successfully"
      };
    }
    if (!this.validateUniqueEmail(userDetails, users)) {
      return {
        "status": false,
        "message": "A user is already register with this email id"
      };
    }
    return {
      "status": false,
      "message": "User Details are missing"
    }
  }

  static validateUniqueEmail(userDetails, users) {
    const user = users.users.some(u => u.email === userDetails.email);
    if (user) return false;
    return true;
  }

  static validateEmail(userDetails) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(userDetails.email))
      return false;
    else
      return true;

  }

}
module.exports = validator;

