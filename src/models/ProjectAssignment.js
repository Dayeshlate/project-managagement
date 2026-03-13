const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectAssignment = sequelize.define(
  'ProjectAssignment',
  {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'project_assignments',
    timestamps: false,
    underscored: true,
  }
);

module.exports = ProjectAssignment;
