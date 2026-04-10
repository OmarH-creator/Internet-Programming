const authService = require("../services/authService");
const {
  normalizeRegisterInput,
  normalizeLoginInput,
  validateRegisterInput,
  validateLoginInput
} = require("../utils/authValidation");

const register = async (req, res) => {
  try {
    const normalized = normalizeRegisterInput(req.body);
    const { isValid, errors } = validateRegisterInput(normalized);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    const payload = await authService.registerUser(normalized);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: payload
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || "Registration failed"
    });
  }
};

const login = async (req, res) => {
  try {
    const normalized = normalizeLoginInput(req.body);
    const { isValid, errors } = validateLoginInput(normalized);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    const payload = await authService.loginUser(normalized);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: payload
    });
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      success: false,
      message: error.message || "Login failed"
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);

    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message || "User not found"
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};