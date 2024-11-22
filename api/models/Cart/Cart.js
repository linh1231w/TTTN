const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('../User/user');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Carts',
});

Cart.belongsTo(User, { foreignKey: 'userId' });

module.exports = Cart;