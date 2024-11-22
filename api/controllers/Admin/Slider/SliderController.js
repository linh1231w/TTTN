const Slider = require('../../../models/Slider/Slider');
const path = require('path');
const fs = require('fs');

exports.createSlider = async (req, res) => {
  try {
    const { name, status } = req.body;
    const image = req.file;  // Lấy tên hình ảnh từ req.file
    const newSlider = await Slider.create({
      name,
      status,
      image: `/images/${image.filename}` // Lưu đường dẫn hình ảnh
    });

    res.status(201).json({
      message: 'Slider created successfully',
      slider: newSlider
    });
  } catch (error) {
    console.error('Error creating slider:', error);
    res.status(500).json({ error: 'Error creating slider' });
  }
};

exports.updateSlider = async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  const newImage = req.file ? req.file.filename : null; // Lấy tên hình ảnh mới từ req.file
  try {
    const slider = await Slider.findByPk(id);

    if (slider) {
      // Xóa hình ảnh cũ nếu có
      if (slider.image && newImage) {
        const imageName = path.basename(new URL(slider.image, 'http://localhost:5011/api/admin').pathname);
        const oldImagePath = path.join(__dirname, '../../../Image', imageName);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      await slider.update({
        name,
        status,
        image: newImage ? `/images/${newImage}` : slider.image // Cập nhật tên hình ảnh mới nếu có
      });

      res.status(200).json({
        message: 'Slider updated successfully',
        slider
      });
    } else {
      res.status(404).json({ message: 'Slider not found' });
    }
  } catch (error) {
    console.error('Error updating slider:', error);
    res.status(500).json({ error: 'Error updating slider' });
  }
};

exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.findAll();
    res.status(200).json(sliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ error: 'Error fetching sliders' });
  }
};

exports.getSliderById = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await Slider.findByPk(id);
    if (slider) {
      res.status(200).json(slider);
    } else {
      res.status(404).json({ message: 'Slider not found' });
    }
  } catch (error) {
    console.error('Error fetching slider:', error);
    res.status(500).json({ error: 'Error fetching slider' });
  }
};

exports.deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Tìm Slider theo ID
    const slider = await Slider.findByPk(id);
    
    if (slider) {
      // Xóa hình ảnh nếu có
      if (slider.image) {
        const imageName = path.basename(new URL(slider.image, 'http://localhost:5011/api/admin').pathname);
        const imagePath = path.join(__dirname, '../../../Image', imageName);
        
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await Slider.destroy({ where: { id } });

      res.status(200).json({ message: 'Slider deleted successfully' });
    } else {
      res.status(404).json({ message: 'Slider not found' });
    }
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({ error: 'Error deleting slider' });
  }
};