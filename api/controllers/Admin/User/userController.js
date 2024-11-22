const Role = require("../../../models/User/role");
const User = require("../../../models/User/user");
const bcrypt = require('bcryptjs');
const UserRole = require("../../../models/User/userRole");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          as: 'roles', // Sử dụng alias đã thiết lập trong mối quan hệ
          attributes: ['id', 'name'] // Chọn các thuộc tính cần thiết từ mô hình Role
        }
      ]
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
};



exports.createUserAndAssignRoles = async (req, res) => {
  try {
    const { name, email, password, address, roleIds } = req.body;

    // Tạo người dùng mới
    const user = await User.create({ name, email, password, address });

    // Nếu có roleIds, gán tất cả các vai trò cho người dùng
    if (roleIds && roleIds.length > 0) {
      // Tìm tất cả các vai trò
      const roles = await Role.findAll({ where: { id: roleIds } });
      if (roles.length !== roleIds.length) {
        return res.status(404).json({ error: 'Some roles not found' });
      }

      // Tạo mới thông tin người dùng với các vai trò
      const userRolePromises = roleIds.map(roleId => UserRole.create({ userId: user.id, roleId }));
      await Promise.all(userRolePromises);
    }

    res.status(201).json({ user, message: 'User created and roles assigned successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
};


//update
// exports.updateUserRole = async (req, res) => {
//     const { userId, oldRoleId, newRoleId } = req.body;
  
//     try {
//       // Tìm người dùng theo ID
//       const user = await User.findByPk(userId);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       // Tìm vai trò cũ và mới theo ID
//       const oldRole = await Role.findByPk(oldRoleId);
//       const newRole = await Role.findByPk(newRoleId);
  
//       if (!oldRole) {
//         return res.status(404).json({ error: 'Old role not found' });
//       }
//       if (!newRole) {
//         return res.status(404).json({ error: 'New role not found' });
//       }
  
//       // Xóa vai trò cũ của người dùng
//       await UserRole.destroy({ where: { userId, roleId: oldRoleId } });
  
     
//       await UserRole.create({ userId, roleId: newRoleId });
  
//       res.json({ message: 'User role updated successfully' });
//     } catch (err) {
//       res.status(500).json({ error: 'Something went wrong' });
//     }
//   };


//sua
// controllers/userController.js

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, address, roleIds } = req.body;
  
    console.log(id,name,email,password,address,roleIds);
  
    try {
      // Tìm người dùng theo ID
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Cập nhật thông tin người dùng
      if (name) user.name = name;
      if (email) user.email = email;
      if (address) user.address = address;
      if (password) user.password = await bcrypt.hash(password, 10);
  
      // Lưu thay đổi thông tin người dùng
      await user.save();
  
      // Cập nhật vai trò nếu có
      if (roleIds && Array.isArray(roleIds)) {
        // Xóa tất cả vai trò hiện tại của người dùng
        await UserRole.destroy({ where: { userId: id } });
  
        // Thêm các vai trò mới cho người dùng
        for (const roleId of roleIds) {
          const role = await Role.findByPk(roleId);
          if (!role) {
            return res.status(404).json({ error: `Role with ID ${roleId} not found` });
          }
          await UserRole.create({ userId: id, roleId });
        }
      }
  
      res.json({ message: 'User updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  };
  
  // Example usage: PUT /users/:id

  //xoa
  exports.deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Xóa vai trò của người dùng
      await UserRole.destroy({ where: { userId: id } });
      
      // Xóa người dùng
      await user.destroy();
      res.status(200).json({ message: 'User deleted successfully' }); // Thành công và trả về JSON
    } catch (err) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  };


