const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Kết nối database
const Image = require('./ProductImage');
const Brand = require('../Brand/Brand');
const Category = require('../Category/Category');

const Product = sequelize.define('Product', {
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
  brandId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  salePrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Trạng thái mặc định là 'đang hoạt động'
  },
}, {
    tableName: 'Products', // Đảm bảo tên bảng trùng khớp
  });

  Product.hasMany(Image, { as: 'images' });
  Image.belongsTo(Product);
Product.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });
  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
module.exports = Product;
