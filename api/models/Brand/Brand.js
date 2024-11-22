// models/Brand.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Brand = sequelize.define('Brand', {
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
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }, metakey: {
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
  tableName: 'Brands',
  timestamps: true
});

module.exports = Brand;
