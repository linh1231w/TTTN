  const Menu = require("../../../models/Menu/Menu");

exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

//get menu one id

                           