const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Kết nối database
const Product = require('./Product');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
 
  isMain: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Hình ảnh mặc định là phụ
  },
  uid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
    tableName: 'ProductImages', // Đảm bảo tên bảng trùng khớp
  });
  
 
 
module.exports = Image;
