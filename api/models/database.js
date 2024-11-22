const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('csdltt', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    logging: false,
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');

    // Tạo bảng nếu chưa tồn tại
    sequelize.sync({ force: false })  // 'force: false' để không xóa bảng nếu đã tồn tại
      .then(() => {
        console.log('Tables have been synchronized.');
      })
      .catch(syncErr => {
        console.error('Error synchronizing tables:', syncErr);
      });

  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  })

module.exports = sequelize;
