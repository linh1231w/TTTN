const Brand = require("../../../models/Brand/Brand");
const path = require('path');
const fs = require('fs'); // Nếu bạn cũng cần sử dụng fs để xóa tệp
const { console } = require("inspector");
exports.createBrand = async (req, res) => {
    try {
      const { slug, name, metakey, metadesc, status } = req.body;
      const image = req.file ;  // Lấy tên hình ảnh từ req.file
      const newBrand = await Brand.create({
        slug,
        name,
        metakey,
        metadesc,
        status,
        image: `/images/${image.filename}` // Lưu đường dẫn hình ảnh
      });
  
      res.status(201).json({
        message: 'Brand created successfully',
        brand: newBrand
      });
    } catch (error) {
      console.error('Error creating brand:', error);
      res.status(500).json({ error: 'Error creating brand' });
    }
  };


  exports.updateBrand = async (req, res) => {
    const { id } = req.params;
      const { slug, name, metakey, metadesc, status } = req.body;
      const newImage = req.file ? req.file.filename : null; // Lấy tên hình ảnh mới từ req.file
    try {
      
  
    
      const brand = await Brand.findByPk(id);
  
      if (brand) {
        // Xóa hình ảnh cũ nếu có
        if (brand.image && newImage) {
            const imageName = path.basename(new URL(brand.image, 'http://localhosthttp://localhost:5011/api/admin').pathname);
            const oldImagePath = path.join(__dirname, '../../../Image', imageName);

          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
  
       
        await brand.update({
          slug,  
          name,
          metakey,
          metadesc,
          status,
          image: newImage ? `/images/${newImage}` : brand.image // Cập nhật tên hình ảnh mới nếu có
        });
  
        res.status(200).json({
          message: 'Brand updated successfully',
          brand
        });
      } else {
        res.status(404).json({ message: 'Brand not found' });
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      res.status(500).json({ error: 'Error updating brand' });
    }
  };
  
  // Lấy tất cả Brand
  exports.getAllBrands = async (req, res) => {
    try {
      const brands = await Brand.findAll();
      res.status(200).json(brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
      res.status(500).json({ error: 'Error fetching brands' });
    }
  };

  // Lấy Brand theo ID
  exports.getBrandById = async (req, res) => {
    try {
      const { id } = req.params;
      const brand = await Brand.findByPk(id);
      if (brand) {
        res.status(200).json(brand);
      } else {
        res.status(404).json({ message: 'Brand not found' });
      }
    } catch (error) {
      console.error('Error fetching brand:', error);
      res.status(500).json({ error: 'Error fetching brand' });
    }
  };
  
  // Xóa Brand theo ID
  exports.deleteBrand = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Tìm Brand theo ID
      const brand = await Brand.findByPk(id);
      
      if (brand) {
        // Xóa hình ảnh nếu có
        if (brand.image) {
            const imageName = path.basename(new URL(brand.image, 'http://localhosthttp://localhost:5011/api/admin').pathname);
          const imagePath = path.join(__dirname, '../../../Image', imageName);
          
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
  
       
        await Brand.destroy({ where: { id } });
  
        res.status(200).json({ message: 'Brand deleted successfully' });
      } else {
        res.status(404).json({ message: 'Brand not found' });
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      res.status(500).json({ error: 'Error deleting brand' });
    }
  };