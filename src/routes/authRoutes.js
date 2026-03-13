const express = require('express');
const { register, login } = require('../controllers/authController');
const {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} = require('../utils/validators');

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    Create user account
 * @access  Public
 */
router.post('/register', validateRegister, handleValidationErrors, register);

/**
 * @route   POST /auth/login
 * @desc    Login with email/password
 * @access  Public
 */
router.post('/login', validateLogin, handleValidationErrors, login);

module.exports = router;
