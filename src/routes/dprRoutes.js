const express = require('express');
const { createDailyReport, getDailyReportsByProject } = require('../controllers/dprController');
const { authMiddleware } = require('../middleware/auth');
const { validateDPRCreate, handleValidationErrors } = require('../utils/validators');

const router = express.Router({ mergeParams: true });

/**
 * @route   POST /projects/:id/dpr
 * @desc    Create DPR for project
 * @access  Private
 */
router.post(
  '/',
  authMiddleware,
  validateDPRCreate,
  handleValidationErrors,
  createDailyReport
);

/**
 * @route   GET /projects/:id/dpr
 * @desc    List DPRs for project
 * @access  Private
 */
router.get('/', authMiddleware, getDailyReportsByProject);

module.exports = router;
