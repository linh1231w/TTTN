                                                                                                                //get by id

const Menu = require("../../../models/Menu/Menu");

exports.createMenu = async (req, res) => {
  try {
    const { name, url } = req.body;
    console.log(name, url);

    const newMenu = await Menu.create({
      name,
      url
    });

    res.status(201).json({
      message: 'Menu created successfully',
      menu: newMenu
    });
  } catch (error) {
    console.error('Error creating menu:', error);
    res.status(500).json({ error: 'Error creating menu' });
  }
};

// Cập nhật một menu theo ID
exports.updateMenuById = async (req, res) => {
  try {
    const menuId = req.params.id;
    const { name, url } = req.body;

    const [numberOfAffectedRows] = await Menu.update(
      { name, url },
      {
        where: { id: menuId },
      }
    );
    
    if (numberOfAffectedRows > 0) {
      const updatedMenu = await Menu.findByPk(menuId);
      res.status(200).json(updatedMenu);
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  } catch (error) {
    console.error('Error updating menu by ID:', error);
    res.status(500).json({ error: 'Error updating menu by ID' });
  }
};

// Lấy tất cả các menu
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll();
    res.status(200).json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ error: 'Error fetching menus' });
  }
};

// Lấy một menu theo ID
exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id);
    if (menu) {
      res.status(200).json(menu);
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Error fetching menu' });
  }
};

// Xóa menu theo ID
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Menu.destroy({ where: { id } });
    if (result) {
      res.status(200).json({ message: 'Menu deleted successfully' });
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  } catch (error) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ error: 'Error deleting menu' });
  }
};
  