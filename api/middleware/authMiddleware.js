const jwt = require('jsonwebtoken');
const UserRole = require('../models/User/userRole');
const Role = require('../models/User/role');
const User = require('../models/User/user');

// Middleware xác thực
const authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware phân quyền
const authorize = (roles) => async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      console.log(`Checking roles for user: ${req.user.id}`);
  
      const userRoles = await UserRole.findAll({
        where: { userId: req.user.id },
        include: [Role],
      });
  
      const userRoleNames = userRoles.map(userRole => userRole.Role.name);
      console.log(`User roles: ${userRoleNames}`);
  
      if (roles.some(role => userRoleNames.includes(role))) {
        next();
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };



  const auth = async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { id: decoded.id } });
        if (user) {
          req.user = user;
        }
      }
      next();
    } catch (error) {
      next();
    }
  };



  const optionalAuth = async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { id: decoded.id } });
        if (user) {
          req.user = user;
          req.isAuthenticated = true;
        } else {
          req.isAuthenticated = false;
        }
      } else {
        req.isAuthenticated = false;
      }
      next();
    } catch (error) {
      req.isAuthenticated = false;
      next();
    }
  };
  

module.exports = { authenticate, authorize, auth,optionalAuth };
