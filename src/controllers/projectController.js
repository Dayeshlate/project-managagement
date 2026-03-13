const { Project, User, DailyReport } = require('../models');
const AppError = require('../utils/errors');

const getUniqueAssignedIds = (assignedUserIds = []) => {
  if (!Array.isArray(assignedUserIds)) {
    return [];
  }
  return [...new Set(assignedUserIds.map(Number))];
};

const fetchAndValidateAssignedUsers = async (assignedUserIds, transaction) => {
  if (!assignedUserIds.length) {
    return [];
  }

  const users = await User.findAll({
    where: { id: assignedUserIds },
    transaction,
  });

  if (users.length !== assignedUserIds.length) {
    throw new AppError('One or more assigned users were not found', 400);
  }

  return users;
};

const createProject = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, budget, location, assignedUserIds } = req.body;
    const createdBy = req.user.userId;
    const uniqueAssignedIds = getUniqueAssignedIds(assignedUserIds);

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      throw new AppError('Start date must be before end date', 400);
    }

    const result = await Project.sequelize.transaction(async (transaction) => {
      const project = await Project.create(
        {
          name,
          description,
          start_date: startDate,
          end_date: endDate,
          budget,
          location,
          created_by: createdBy,
        },
        { transaction }
      );

      const assignedUsers = await fetchAndValidateAssignedUsers(uniqueAssignedIds, transaction);
      await project.setAssignedUsers(assignedUsers, { transaction });

      return Project.findByPk(project.id, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: User,
            as: 'assignedUsers',
            attributes: ['id', 'name', 'email', 'role'],
            through: { attributes: [] },
          },
        ],
        transaction,
      });
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      projectId: result.id,
      project: result,
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
      distinct: true,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: User,
          as: 'assignedUsers',
          attributes: ['id', 'name', 'email', 'role'],
          through: { attributes: [] },
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
          model: DailyReport,
          as: 'dailyReports',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
        {
          model: User,
          as: 'assignedUsers',
          attributes: ['id', 'name', 'email', 'role'],
          through: { attributes: [] },
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
    const { name, description, startDate, endDate, status, budget, location, assignedUserIds } =
      req.body;
    const hasAssignedUsersUpdate = Array.isArray(assignedUserIds);
    const uniqueAssignedIds = getUniqueAssignedIds(assignedUserIds);

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

    const updatedProject = await Project.sequelize.transaction(async (transaction) => {
      await project.update(
        {
          name: name || project.name,
          description: description !== undefined ? description : project.description,
          start_date: startDate || project.start_date,
          end_date: endDate || project.end_date,
          status: status || project.status,
          budget: budget !== undefined ? budget : project.budget,
          location: location || project.location,
        },
        { transaction }
      );

      if (hasAssignedUsersUpdate) {
        const assignedUsers = await fetchAndValidateAssignedUsers(uniqueAssignedIds, transaction);
        await project.setAssignedUsers(assignedUsers, { transaction });
      }

      return Project.findByPk(project.id, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: User,
            as: 'assignedUsers',
            attributes: ['id', 'name', 'email', 'role'],
            through: { attributes: [] },
          },
        ],
        transaction,
      });
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject,
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
