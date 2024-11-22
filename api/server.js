
require('dotenv').config(); // Đặt dòng này ở đầu file chính của ứng dụng
const cors = require('cors');
const express = require('express');
const app = express();
const port = 5011;

// Import routes
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const path = require('path');
// Import Sequelize và mô hình
const sequelize = require('./models/database');
const User = require('./models/User/user');
const Role = require('./models/User/role');
const UserRole = require('./models/User/userRole');
const menuRoutes = require('./models/Menu/Menu');
User.belongsToMany(Role, { through: UserRole, as: 'roles', foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, as: 'users', foreignKey: 'roleId' });
const Product = require('./models/Product/Product'); 
const ProductImage = require('./models/Product/ProductImage'); 
const Category = require('./models/Category/Category'); 
const Brand = require('./models/Brand/Brand'); 
// const Admin = require('./models/admin');
const Cart = require('./models/Cart/Cart');
const uploadRoutes = require('./routes/upload');
const session = require('express-session');

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // false cho HTTP (localhost), true cho HTTPS (production)
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // Ví dụ: giữ session 7 ngày
  }
}));

// Sử dụng các routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/images', express.static(path.join(__dirname, './Image')));
app.use('/api/images', express.static(path.join(__dirname, './Image')));
// Routes menu
// app.use('/api/menu', menuRoutes);
// app.use('/api/categories', categoryRoutes);

// Kết nối với cơ sở dữ liệu và đồng bộ hóa mô hình
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync({}); // Đồng bộ hóa các mô hình với cơ sở dữ liệu
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Bắt đầu máy chủ
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
