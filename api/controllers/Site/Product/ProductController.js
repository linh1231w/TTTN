const { Op } = require('sequelize');
const Brand = require('../../../models/Brand/Brand');
const Category = require('../../../models/Category/Category');
const Product  = require('../../../models/Product/Product'); // Import các model cần thiết
const Image = require('../../../models/Product/ProductImage');



//tao san pham va image 




//get all product
exports.getAllProducts = async (req, res) => {
    try {
        // Gọi findAll() để lấy tất cả sản phẩm
        const products = await Product.findAll({
            include: [{ model: Image, as: 'images' }] // Bao gồm hình ảnh liên kết với sản phẩm
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



exports.getProductById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Tìm sản phẩm theo ID
      const product = await Product.findByPk(id, {
        include: [
          {
            model: Image,
            as: 'images', // Tên alias đã định nghĩa trong model association
            attributes: ['url', 'isMain', 'uid'], // Chỉ lấy các thuộc tính cần thiết
          },
          {
            model: Brand,
            as: 'brand',
            attributes: ['name','slug'], // Lấy tên thương hiệu
          },
          {
            model: Category,
            as: 'category',
            attributes: ['name','slug'], // Lấy tên danh mục
          }
        ]
      });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Format lại dữ liệu để đảm bảo định dạng hợp lệ cho front-end
      const formattedProduct = {
        ...product.toJSON(),
        images: product.images.map(image => ({
          id: image.id,
          url: image.url, // Đảm bảo URL hình ảnh được trả về đúng định dạng
          isMain: image.isMain,
          uid: image.uid
        })),
        brand: product.brand, // Đảm bảo thương hiệu được trả về đúng định dạng
        category: product.category // Đảm bảo danh mục được trả về đúng định dạng
      };
  
      res.json(formattedProduct);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };



  
