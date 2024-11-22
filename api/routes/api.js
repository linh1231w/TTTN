const express = require("express");
const router = express.Router();

const userController = require("../controllers/Admin/User/userController");
//user
router.post("/user", userController.createUserAndAssignRoles);

//product & upload anh

const ProductController = require("../controllers/Site/Product/ProductController");
const ProductControllerr = require("../controllers/Admin/Product/ProductController");
router.get("/product", ProductControllerr.getAllProducts);

router.get("/product/:id", ProductController.getProductById);
router.get('/productt', ProductControllerr.searchProducts);
//category
const CategoryController = require("../controllers/Admin/Categrory/categoryController");
router.get("/category", CategoryController.getAllCategories);

router.get("/category/:id", CategoryController.getCategoryById);
//brand

const brandController = require("../controllers/Admin/Brand/brandController");

router.get("/brand", brandController.getAllBrands);

router.get("/brand/:id", brandController.getBrandById);

//menu
const {
  getAllMenus,
  getMenuById,
} = require("../controllers/Admin/Menu/menuController");
router.get("/menu", getAllMenus);
router.get("/menu/:id", getMenuById);

// Slider routes
const upload = require('../middleware/multer');
const SliderController = require('../controllers/Admin/Slider/SliderController');
router.get('/slider', SliderController.getAllSliders);
router.get('/slider/:id', SliderController.getSliderById);
router.post('/slider', upload.single('image'), SliderController.createSlider);
router.put('/slider/:id', upload.single('image'), SliderController.updateSlider);
router.delete('/slider/:id', SliderController.deleteSlider);
//cart
const cartController = require("../controllers/Admin/Cart/cartCotroller");
const { auth } = require("../middleware/authMiddleware");
const { optionalAuth } = require("../middleware/authMiddleware");

router.post('/cart', optionalAuth, cartController.addToCart);
router.get('/cart', optionalAuth, cartController.getCart);
router.put('/cart/:id', optionalAuth, cartController.updateCartItem);
router.delete('/cart/:id', optionalAuth, cartController.removeFromCart);
router.post('/cart/sync', auth, cartController.syncCart);
 //order
const orderController = require("../controllers/Admin/Order/OrderController");
router.get('/order',  orderController.getOrdersByEmail);
router.post('/order/callback', orderController.handleZaloPayCallback);

router.post('/order', orderController.createOrder);
module.exports = router;
