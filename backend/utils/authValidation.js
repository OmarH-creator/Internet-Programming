const validator = require("validator");

const USERNAME_REGEX = /^[A-Za-z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const normalizeRegisterInput = ({ username, email, password }) => {
  return {
    username: (username || "").trim().toLowerCase(),
    email: (email || "").trim().toLowerCase(),
    password: (password || "").trim()
  };
};

const normalizeLoginInput = ({ identifier, email, password }) => {
  const rawIdentifier = identifier || email || "";
  return {
    identifier: rawIdentifier.trim().toLowerCase(),
    password: (password || "").trim()
  };
};

const validateRegisterInput = ({ username, email, password }) => {
  const errors = [];

  if (!username) {
    errors.push("Username is required");
  } else if (!USERNAME_REGEX.test(username)) {
    errors.push(
      "Username must be 3-20 characters and contain only letters, numbers, or underscore"
    );
  }

  if (!email) {
    errors.push("Email is required");
  } else if (!validator.isEmail(email)) {
    errors.push("Email format is invalid");
  }

  if (!password) {
    errors.push("Password is required");
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.push("Password must be at least 8 characters and include at least one letter and one number");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateLoginInput = ({ identifier, password }) => {
  const errors = [];

  if (!identifier) {
    errors.push("Username or email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  normalizeRegisterInput,
  normalizeLoginInput,
  validateRegisterInput,
  validateLoginInput
};