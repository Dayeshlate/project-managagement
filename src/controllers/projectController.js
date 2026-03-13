const { Project, User } = require('../models');
const AppError = require('../utils/errors');

const createProject = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, budget, location } = req.body;
    const createdBy = req.user.userId;

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      throw new AppError('Start date must be before end date', 400);
    }

    const project = await Project.create({
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      budget,
      location,
      created_by: createdBy,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      projectId: project.id,
      project,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const { status, limit = 10, offset = 0 } = req.query;

    const whereClause = status ? { status } : {};

    const { count, rows } = await Project.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: rows,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: 'DailyReport',
          as: 'dailyReports',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, status, budget, location } =
      req.body;

    const project = await Project.findByPk(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Check authorization (only creator or admin can update)
    if (project.created_by !== req.user.userId && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this project', 403);
    }

    // Validate dates if provided
    const sDate = startDate || project.start_date;
    const eDate = endDate || project.end_date;
    if (new Date(sDate) > new Date(eDate)) {
      throw new AppError('Start date must be before end date', 400);
    }

    await project.update({
      name: name || project.name,
      description: description !== undefined ? description : project.description,
      start_date: startDate || project.start_date,
      end_date: endDate || project.end_date,
      status: status || project.status,
      budget: budget !== undefined ? budget : project.budget,
      location: location || project.location,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Only admin can delete
    if (req.user.role !== 'admin') {
      throw new AppError('Only admins can delete projects', 403);
    }

    const project = await Project.findByPk(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    await project.destroy();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
