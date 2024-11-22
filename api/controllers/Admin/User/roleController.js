const Role = require("../../../models/User/role");


exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.json(roles);
      } catch (err) {
        res.status(500).json({ error: 'Something went wrong', details: err.message });
      }
    };


    exports.createRoles =  async (req, res) => {
        const { name } = req.body;
        
        try {
          const role = await Role.create({ name });
          res.status(201).json({ role });
        } catch (err) {
          res.status(500).json({ error: 'Something went wrong', details: err.message });
        }
      };







      exports.updateRoles= async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        
        try {
          const role = await Role.findByPk(id);
          if (!role) {
            return res.status(404).json({ error: 'Role not found' });
          }
          
          role.name = name;
          await role.save();
          res.json({ role });
        } catch (err) {
          res.status(500).json({ error: 'Something went wrong', details: err.message });
        }
      };
      
      // Xóa vai trò
      exports.deleteRoles=  async (req, res) => {
        const { id } = req.params;
        
        try {
          const role = await Role.findByPk(id);
          if (!role) {
            return res.status(404).json({ error: 'Role not found' });
          }
          
          await role.destroy();
          res.status(204).send();
        } catch (err) {
          res.status(500).json({ error: 'Something went wrong', details: err.message });
        }
      };