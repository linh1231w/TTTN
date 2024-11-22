// controllers/authController.js

const jwt = require('jsonwebtoken');
const User = require('../../../models/User/user');
const bcrypt = require('bcryptjs'); // Giả sử bạn đã dùng bcrypt để băm mật khẩu
const Role = require('../../../models/User/role');
const UserRole = require('../../../models/User/userRole');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ where: { email },
    

    });

    
  console.log(user)
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // So sánh mật khẩu đã băm
    const isMatch = await bcrypt.compare(password, user.password);
 
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const userRoles = await UserRole.findAll({
        where: { userId: user.id },
        include: {
          model: Role,
          attributes: ['name'],
        },
      });

      const roles = userRoles.map(userRole => userRole.Role.name);
   

    // Tạo token JWT
    const token = jwt.sign({ id: user.id, email: user.email,role:roles,name:user.name,phone:user.phone,address:user.address }, process.env.JWT_SECRET, { expiresIn: '10h' });
    console.log('Token:', token);
    // Trả về token
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
