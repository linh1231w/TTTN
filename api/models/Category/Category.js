// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  metakey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  metadesc: {
    type: DataTypes.STRING,
    allowNull: false,
  },status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, 
  }
}, {
  tableName: 'Categories',
  timestamps: true
});

module.exports = Category;
