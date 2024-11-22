const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Đường dẫn tới file cấu hình database

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Đảm bảo mỗi vai trò chỉ xuất hiện một lần
  },
}, {
  tableName: 'Roles', // Đảm bảo tên bảng trùng khớp
});

module.exports = Role;
