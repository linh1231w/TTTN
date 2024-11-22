const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Đường dẫn tới file cấu hình database
const bcrypt = require('bcryptjs');


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Đảm bảo email là duy nhất
    validate: {
      isEmail: true, // Đảm bảo giá trị là email hợp lệ
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Users', // Đảm bảo tên bảng trùng khớp
});
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});





module.exports = User;
