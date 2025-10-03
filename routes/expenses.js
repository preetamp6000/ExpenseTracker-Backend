const express = require('express');
const { body, param, query } = require('express-validator');
const expenseController = require('../controllers/expenseController');
const { authenticateToken } = require('../middleware/authMiddleware'); // ← Changed this
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

const expenseValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .isIn(['food', 'transportation', 'entertainment', 'utilities', 'healthcare', 'shopping', 'education', 'travel', 'other'])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
    .trim()
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid expense ID')
];

const queryValidation = [
  query('category')
    .optional()
    .isIn(['food', 'transportation', 'entertainment', 'utilities', 'healthcare', 'shopping', 'education', 'travel', 'other'])
    .withMessage('Invalid category'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// All routes are protected
router.use(authenticateToken);

router.post('/', expenseValidation, handleValidationErrors, expenseController.addExpense);
router.get('/', queryValidation, handleValidationErrors, expenseController.getExpenses);
router.put('/:id', [...idValidation, ...expenseValidation], handleValidationErrors, expenseController.updateExpense);
router.delete('/:id', idValidation, handleValidationErrors, expenseController.deleteExpense);

module.exports = router;