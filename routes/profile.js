const express = require('express');
const { body } = require('express-validator');
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware'); // ← Changed this
const { handleValidationErrors } = require('../middleware/validation');


const router = express.Router();

const updateProfileValidation = [
  body('firstName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters')
    .trim(),
  body('lastName')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters')
    .trim(),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
    .trim()
];

// All routes are protected
router.use(authenticateToken);

router.get('/', profileController.getProfile);
router.put('/', updateProfileValidation, handleValidationErrors, profileController.updateProfile);

module.exports = router;