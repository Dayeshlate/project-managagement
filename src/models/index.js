const User = require('./User');
const Project = require('./Project');
const DailyReport = require('./DailyReport');

// Define relationships
User.hasMany(Project, {
  foreignKey: 'created_by',
  as: 'projects',
});

Project.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator',
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
};
