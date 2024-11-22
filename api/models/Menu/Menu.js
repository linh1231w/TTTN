// models/Menu.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Đảm bảo đường dẫn tới file database.js đúng

const Menu = sequelize.define('Menu', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'menus',
  timestamps: true
});

module.exports = Menu;
