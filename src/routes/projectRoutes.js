const express = require('express');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
  validateProjectCreate,
  validateProjectUpdate,
  validatePaginationQuery,
  handleValidationErrors,
} = require('../utils/validators');

const router = express.Router();

/**
 * @route   POST /projects
 * @desc    Create project (admin/manager only)
 * @access  Private (admin, manager)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware('admin', 'manager'),
  validateProjectCreate,
  handleValidationErrors,
  createProject
);

/**
 * @route   GET /projects
 * @desc    List all projects with pagination
 * @access  Private
 */
router.get(
  '/',
  authMiddleware,
  validatePaginationQuery,
  handleValidationErrors,
  getAllProjects
);

/**
 * @route   GET /projects/:id
 * @desc    Get single project details
 * @access  Private
 */
router.get('/:id', authMiddleware, getProjectById);

/**
 * @route   PUT /projects/:id
 * @desc    Update project
 * @access  Private (creator or admin)
 */
router.put(
  '/:id',
  authMiddleware,
  validateProjectUpdate,
  handleValidationErrors,
  updateProject
);

/**
 * @route   DELETE /projects/:id
 * @desc    Delete project (admin only)
 * @access  Private (admin)
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteProject);

module.exports = router;
