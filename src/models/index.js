const User = require('./User');
const Project = require('./Project');
const DailyReport = require('./DailyReport');
const ProjectAssignment = require('./ProjectAssignment');

// Define relationships
User.hasMany(Project, {
  foreignKey: 'created_by',
  as: 'projects',
});

Project.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator',
});

Project.belongsToMany(User, {
  through: ProjectAssignment,
  foreignKey: 'project_id',
  otherKey: 'user_id',
  as: 'assignedUsers',
});

User.belongsToMany(Project, {
  through: ProjectAssignment,
  foreignKey: 'user_id',
  otherKey: 'project_id',
  as: 'assignedProjects',
});

Project.hasMany(DailyReport, {
  foreignKey: 'project_id',
  as: 'dailyReports',
});

DailyReport.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project',
});

DailyReport.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasMany(DailyReport, {
  foreignKey: 'user_id',
  as: 'dailyReports',
});

module.exports = {
  User,
  Project,
  DailyReport,
  ProjectAssignment,
};
