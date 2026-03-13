const { body, validationResult, query } = require('express-validator');

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validateProjectCreate = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').optional().trim(),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
];

const validateProjectUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
  body('description').optional().trim(),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('status')
    .optional()
    .isIn(['planned', 'active', 'completed'])
    .withMessage('Status must be planned, active, or completed'),
];

const validateDPRCreate = [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('work_description').trim().notEmpty().withMessage('Work description is required'),
  body('weather').optional().trim(),
  body('worker_count')
    .isInt({ min: 1 })
    .withMessage('Worker count must be a positive integer'),
];

const validatePaginationQuery = [
  query('limit').optional().isInt({ min: 1 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProjectCreate,
  validateProjectUpdate,
  validateDPRCreate,
  validatePaginationQuery,
  handleValidationErrors,
};
