const validator = require("validator");

const USERNAME_REGEX = /^[A-Za-z0-9_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const PHONE_E164_REGEX = /^\+[1-9]\d{7,14}$/;

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

const normalizeUpdateAccountInput = ({ email, password }) => {
  const normalizedEmail =
    email == null ? undefined : String(email).trim().toLowerCase();
  const normalizedPassword =
    password == null ? undefined : String(password).trim();

  return {
    email: normalizedEmail === "" ? undefined : normalizedEmail,
    password: normalizedPassword === "" ? undefined : normalizedPassword
  };
};

const validateUpdateAccountInput = ({ email, password }) => {
  const errors = [];

  if (email !== undefined && email !== "" && !validator.isEmail(email)) {
    errors.push("Email format is invalid");
  }

  if (email !== undefined && !password) {
    errors.push("Current password is required to update email");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const normalizeUpdateProfileInput = ({ avatar, banner, bio, gender }) => {
  return {
    avatar: avatar == null ? undefined : String(avatar).trim(),
    banner: banner == null ? undefined : String(banner).trim(),
    bio: bio == null ? undefined : String(bio).trim(),
    gender: gender == null ? undefined : String(gender).trim()
  };
};

const validateUpdateProfileInput = ({ avatar, banner, bio, gender }) => {
  const errors = [];

  if (avatar !== undefined && avatar !== "" && !validator.isURL(avatar, { require_protocol: true })) {
    errors.push("Avatar must be a valid URL with protocol");
  }

  if (banner !== undefined && banner !== "" && !validator.isURL(banner, { require_protocol: true })) {
    errors.push("Banner must be a valid URL with protocol");
  }

  if (bio !== undefined && bio.length > 300) {
    errors.push("Bio must be 300 characters or fewer");
  }

  if (gender !== undefined && gender.length > 50) {
    errors.push("Gender must be 50 characters or fewer");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const normalizeChangePasswordInput = ({ currentPassword, newPassword }) => {
  return {
    currentPassword: (currentPassword || "").trim(),
    newPassword: (newPassword || "").trim()
  };
};

const validateChangePasswordInput = ({ currentPassword, newPassword }) => {
  const errors = [];

  if (!currentPassword) {
    errors.push("Current password is required");
  }

  if (!newPassword) {
    errors.push("New password is required");
  } else if (!PASSWORD_REGEX.test(newPassword)) {
    errors.push("New password must be at least 8 characters and include at least one letter and one number");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};


const normalizeUpdatePhoneInput = ({ phoneNumber, password }) => {
  const normalizedPhone = phoneNumber == null ? "" : String(phoneNumber).trim();
  return {
    phoneNumber: normalizedPhone ? normalizedPhone.replace(/[^\d+]/g, "") : "",
    password: (password || "").trim()
  };
};

const validateUpdatePhoneInput = ({ phoneNumber, password }) => {
  const errors = [];

  if (!phoneNumber) {
    errors.push("Phone number is required");
  } else if (!PHONE_E164_REGEX.test(phoneNumber)) {
    errors.push("Phone number must be in international format (e.g. +201234567890)");
  }

  if (!password) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};


const normalizeDeleteAccountInput = ({ password }) => {
  return {
    password: (password || "").trim()
  };
};

const validateDeleteAccountInput = ({ password }) => {
  const errors = [];

  if (!password) {
    errors.push("Password is required to delete account");
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
  validateLoginInput,
  normalizeUpdateAccountInput,
  validateUpdateAccountInput,
  normalizeUpdateProfileInput,
  validateUpdateProfileInput,
  normalizeChangePasswordInput,
  validateChangePasswordInput,
  normalizeDeleteAccountInput,
  validateDeleteAccountInput,
  normalizeUpdatePhoneInput,
  validateUpdatePhoneInput
};