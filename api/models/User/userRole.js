const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Đường dẫn tới file cấu hình database
const User = require('./user');
const Role = require('./role');

const UserRole = sequelize.define('UserRole', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Tham chiếu mô hình User
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,// Tham chiếu mô hình Role
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'UserRoles', // Đảm bảo tên bảng trùng khớp
});

// Thiết lập mối quan hệ
UserRole.belongsTo(User, { foreignKey: 'userId' });
UserRole.belongsTo(Role, { foreignKey: 'roleId' });

module.exports = UserRole;
