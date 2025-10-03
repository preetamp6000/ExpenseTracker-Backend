const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

const signupValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

router.post('/signup', signupValidation, handleValidationErrors, authController.signup);
router.post('/login', loginValidation, handleValidationErrors, authController.login);
router.post('/logout', authController.logout);

module.exports = router;