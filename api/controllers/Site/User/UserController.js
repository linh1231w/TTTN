const User = require("../../../models/User/user");
const UserRole = require("../../../models/User/userRole");

exports.createUser = async (req, res) => {
    try {
      const { name, email, password,address } = req.body;
      // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword,address });

      const userRole = await Role.findOne({ where: { name: 'User' } });

      if (!userRole) {
        return res.status(404).json({ error: 'Default user role not found' });
      }

      await UserRole.create({ userId: user.id, roleId: userRole.id });


      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  };


  exports.getUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Tìm người dùng theo ID
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  };


  