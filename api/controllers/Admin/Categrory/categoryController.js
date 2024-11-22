const Category = require("../../../models/Category/Category");


exports.createCategory = async (req, res) => {
    try {
      const { slug, name, parentId, metakey, metadesc, status } = req.body;
    console.log(slug, name, parentId, metakey, metadesc, status)
  
      const newCategory = await Category.create({
        slug,
        name,
        parentId,
        metakey,
        metadesc,
        status
      });
  
      res.status(201).json({
        message: 'Category created successfully',
        category: newCategory
      });
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Error creating category' });
    }
  };



  exports.updateCategoryById = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const { slug, name, parentId, metakey, metadesc, status } = req.body;
  
      const [numberOfAffectedRows] = await Category.update(
        { slug, name, parentId, metakey, metadesc, status },
        {
          where: { id: categoryId },
        }
      );
      
      if (numberOfAffectedRows > 0) {
        const updatedCategory = await Category.findByPk(categoryId);
        res.status(200).json(updatedCategory);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      console.error('Error updating category by ID:', error);
      res.status(500).json({ error: 'Error updating category by ID' });
    }
  };

        
exports.getAllCategories = async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Error fetching categories' });
    }
  };
  
 
  exports.getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ error: 'Error fetching category' });
    }
  };
  
  // Xóa Category theo ID
  exports.deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Category.destroy({ where: { id } });
      if (result) {
        res.status(200).json({ message: 'Category deleted successfully' });
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Error deleting category' });
    }
  };