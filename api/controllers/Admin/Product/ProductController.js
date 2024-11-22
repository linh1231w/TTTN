const Product = require("../../../models/Product/Product");
const Image = require("../../../models/Product/ProductImage");



const path = require('path');
const fs = require('fs');
const Brand = require("../../../models/Brand/Brand");
const Category = require("../../../models/Category/Category");
const { Op } = require("sequelize");


exports.addProductWithImages = async (req, res) => {
  try {
    const { name, description, price, salePrice, quantity, status, categoryId, brandId } = req.body;
    const images = req.files // Lấy hình ảnh từ req.files

    const isMainFlags = req.body.isMain || [];
 
    const isIUDFlags = req.body.uid || [];
    console.log(images)
   
    const newProduct = await Product.create({
      name,
      description,
      price,
      salePrice,
      quantity,
      status,
      categoryId, // Thêm categoryId vào
      brandId 
    });

    

    if (images && images.length > 0) {
  const imageRecords = images.map((image, index) => ({
    url: `/images/${image.filename}`,
    isMain: Array.isArray(isMainFlags) ? index === isMainFlags.findIndex(flag => flag === 'true') : isMainFlags,
    uid: isIUDFlags ? isIUDFlags[index] || null : null,
    ProductId: newProduct.id,
  }));
  await Image.bulkCreate(imageRecords);
}


    res.status(201).json({
      message: 'Product and images added successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error adding product with images:', error);
    res.status(500).json({
      error: 'Error adding product with images'
    });
  }
};

//get
exports.getAllProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    console.log(categoryId)
    let whereCondition = {};

    if (categoryId) {
      const categoryIdNumber = parseInt(categoryId, 10);
      
      // Lấy danh mục chính
      const mainCategory = await Category.findByPk(categoryIdNumber);
      if (mainCategory) {
        // Tìm tất cả danh mục con dựa trên parentId
        const childCategories = await Category.findAll({
          where: {
            parentId: categoryIdNumber
          }
        });
        const categoryIds = [categoryIdNumber, ...childCategories.map(cat => cat.id)];
        whereCondition.categoryId = {
          [Op.in]: categoryIds
        };
      } else {
        // Nếu không tìm thấy category, trả về mảng rỗng
        return res.json([]);
      }
    }

    console.log('Where condition:', whereCondition); // Debug log

    // Lấy sản phẩm theo điều kiện
    const products = await Product.findAll({
      where: whereCondition,
      include: [
        {
          model: Image,
          as: 'images',
          attributes: ['url', 'isMain', 'uid'],
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['name'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        }
      ]
    });

    console.log('Products found:', products.length); // Debug log

    // Format lại dữ liệu
    const formattedProducts = products.map(product => ({
      ...product.toJSON(),
      images: product.images.map(image => ({
        id: image.id,
        url: image.url,
        isMain: image.isMain,
        uid: image.uid
      })),
      brand: product.brand ? product.brand.name : null,
      category: product.category ? product.category.name : null
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.updateProductWithImages = async (req, res) => {
  try {
    const { 
     
      name, 
      description, 
      price, 
      salePrice, 
      quantity, 
      status, 
      categoryId, 
      brandId, 
    
    } = req.body;
    const { id } = req.params;
    const oldImages = req.body.imagess
    const newImages = req.files
    const isMainFlags = req.body.isMain||[];
    const Deletedimg = req.body.deletedImages;
    const isIUDFlags = req.body.uid || [];
    console.log(id, name, description, price, salePrice, quantity, status, categoryId, brandId, oldImages,newImages,isMainFlags,isIUDFlags);

    // Tìm sản phẩm theo ID
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cập nhật thông tin sản phẩm
    await product.update({
      name,
      description,
      price,
      salePrice,
      quantity,
      status,
      categoryId,
      brandId
    });

    // Lấy tất cả hình ảnh của sản phẩm từ cơ sở dữ liệu
    const existingImages = await Image.findAll({ where: { ProductId: id } });
    const array = JSON.parse(oldImages);
    const deleteeee = JSON.parse(Deletedimg);
    const oldImageRecords = array.map(img => ({
      url: img.url,
      isMain: img.isMain
    }));

    console.log(oldImageRecords)
    const existingImageUrls = existingImages.map(image => image.url);

    // Xác định các hình ảnh cần cập nhật thuộc tính isMain
    const imagesToUpdate = existingImages.filter(existingImage => {
      const oldImage = oldImageRecords.find(record => record.url === existingImage.url);
      return oldImage && oldImage.isMain !== existingImage.isMain; // Nếu thuộc tính isMain đã thay đổi
    });

   
    if (imagesToUpdate.length > 0) {
      await Promise.all(imagesToUpdate.map(image => {
        const oldImage = oldImageRecords.find(record => record.url === image.url);
        return Image.update({ isMain: oldImage.isMain }, { where: { id: image.id } });
      }));
    }

    // Xóa các hình ảnh không còn xuất hiện trong danh sách cũ
    const oldImageUrls = deleteeee.map(record => record.url);
    const imagesToDelete = existingImages.filter(image => oldImageUrls.includes(image.url));
 
    if (imagesToDelete.length > 0) {
      // Xóa hình ảnh khỏi hệ thống tệp
      imagesToDelete.forEach(image => {
        const imageFilename = path.basename(new URL(image.url, 'http://localhost:5011/api/admin').pathname);
        const filePath = path.join(__dirname, '../../../Image', imageFilename);

        fs.unlink(filePath, err => {
          if (err) {
            console.error('Error deleting image file:', err);
          } else {
            console.log(`Deleted image file: ${filePath}`);
          }
        });
      });

      // Xóa hình ảnh khỏi cơ sở dữ liệu
      await Image.destroy({
        where: { uid: deleteeee.map(image => image.uid) }
      });
    }

    
    const newImageRecords = newImages.map((image, index) => ({
      url: `/images/${image.filename}`,
      
      isMain: Array.isArray(isMainFlags) ? index === isMainFlags.findIndex(flag => flag === 'true') : isMainFlags,
      uid: isIUDFlags ? isIUDFlags[index] || null : null,
      ProductId: id,
    }));

    
    for (const newImageRecord of newImageRecords) {
      const existingImage = existingImages.find(img => img.url === newImageRecord.url);
      if (existingImage) {
        
        await existingImage.update({ isMain: newImageRecord.isMain });
      } else {
        // Thêm hình ảnh mới
        await Image.create(newImageRecord);
      }
    }

    res.status(200).json({
      message: 'Product and images updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product with images:', error);
    res.status(500).json({
      error: 'Error updating product with images'
    });
  }
};


exports.deleteProductWithImages = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm sản phẩm theo ID
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Lấy tất cả hình ảnh liên quan đến sản phẩm
    const images = await Image.findAll({ where: { ProductId: id } });

    // Xóa các file hình ảnh khỏi hệ thống tệp
    images.forEach(image => {
      const imageFilename = path.basename(new URL(image.url, 'http://localhost:5011/api/admin').pathname);
      const filePath = path.join(__dirname, '../../../Image', imageFilename);

      fs.unlink(filePath, err => {
        if (err) {
          console.error(`Error deleting image file: ${filePath}`, err);
        } else {
          console.log(`Deleted image file: ${filePath}`);
        }
      });
    });

    // Xóa các bản ghi hình ảnh trong cơ sở dữ liệu
    await Image.destroy({ where: { ProductId: id } });

    // Xóa sản phẩm
    await product.destroy();

    res.status(200).json({
      message: 'Product and images deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product with images:', error);
    res.status(500).json({
      error: 'Error deleting product with images'
    });
  }
};


exports.searchProducts = async (req, res) => {
  try {
      const { searchKey } = req.query; // Nhận khóa tìm kiếm từ query
      console.log('Searching for:', searchKey);

      // Kiểm tra xem searchKey có hợp lệ không
      if (!searchKey) {
          return res.status(400).json({ error: 'Khóa tìm kiếm không được để trống.' });
      }

      // Xây dựng các điều kiện tìm kiếm
      const searchConditions = {
          where: {
              [Op.or]: [
                  { name: { [Op.like]: `%${searchKey}%` } }, // Tìm trong tên sản phẩm
                  { '$brand.name$': { [Op.like]: `%${searchKey}%` } }, // Tìm trong tên thương hiệu
                  { '$category.name$': { [Op.like]: `%${searchKey}%` } } // Tìm trong tên danh mục
              ],
          },
          include: [
              {
                  model: Brand,
                  as: 'brand',
                  attributes: ['name', 'slug'],
              },
              {
                  model: Category,
                  as: 'category',
                  attributes: ['name', 'slug'],
              },
              {
                  model: Image,
                  as: 'images',
              },
          ],
      };

      // Tìm sản phẩm theo các điều kiện đã xác định
      const products = await Product.findAll(searchConditions);
      console.log('Found Products:', products);

      // Nếu không tìm thấy sản phẩm nào
      if (products.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy sản phẩm nào phù hợp.' });
      }

      // Trả về danh sách sản phẩm tìm thấy
      res.json(products);
  } catch (error) {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error);
      res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
  }
};




