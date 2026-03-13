const { DailyReport, Project, User } = require('../models');
const AppError = require('../utils/errors');

const createDailyReport = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const { date, work_description, weather, worker_count } = req.body;
    const userId = req.user.userId;

    // Validate project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new AppError(`Project with ID ${projectId} not found`, 404);
    }

    const dailyReport = await DailyReport.create({
      project_id: projectId,
      user_id: userId,
      date,
      work_description,
      weather,
      worker_count,
    });

    res.status(201).json({
      success: true,
      message: 'Daily report created successfully',
      dprId: dailyReport.id,
      data: dailyReport,
    });
  } catch (error) {
    next(error);
  }
};

const getDailyReportsByProject = async (req, res, next) => {
  try {
    const { id: projectId } = req.params;
    const { date } = req.query;

    const whereClause = { project_id: projectId };
    if (date) {
      whereClause.date = date;
    }

    const dailyReports = await DailyReport.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['date', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Daily reports retrieved successfully',
      data: dailyReports,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDailyReport,
  getDailyReportsByProject,
};
