const express = require("express");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const User = require("../models/User/user");
const { getUsers, createUserAndAssignRoles, updateUser, deleteUser } = require("../controllers/Admin/User/userController");

const router = express.Router();

router.get("/user", authenticate, authorize(["Admin"]), getUsers);
router.post("/user", createUserAndAssignRoles);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
//role
const roleController = require("../controllers/Admin/User/roleController");
router.post("/role",roleController.createRoles);
router.put('/role/:id',roleController.updateRoles);

router.get("/role", roleController.getRoles);



router.delete("/role/:id", roleController.deleteRoles);
//product
const ProductController = require("../controllers/Admin/Product/ProductController");
const upload = require("../middleware/multer");
router.post(
  "/product",
  upload.array("images"),
  ProductController.addProductWithImages
);
router.get("/product", ProductController.getAllProducts);
router.put("/product/:id",upload.array("images"), ProductController.updateProductWithImages);
router.delete("/product/:id", ProductController.deleteProductWithImages);
//brand
const brandController = require("../controllers/Admin/Brand/brandController");

router.post("/brand", upload.single('image'),brandController.createBrand);
router.put('/brand/:id', upload.single('image'), brandController.updateBrand);

router.get("/brand", brandController.getAllBrands);

router.get("/brand/:id", brandController.getBrandById);

router.delete("/brand/:id", brandController.deleteBrand);
//category
// Route để tạo mới một category
const CategoryController = require("../controllers/Admin/Categrory/categoryController");

router.post('/category', CategoryController.createCategory);

router.get('/category', CategoryController.getAllCategories);


router.get('/category/:id', CategoryController.getCategoryById);


router.put('/category/:id', CategoryController.updateCategoryById);


router.delete('/category/:id', CategoryController.deleteCategory);
//menu
const { createMenu, updateMenuById, getAllMenus, getMenuById, deleteMenu } = require("../controllers/Admin/Menu/menuController");
router.post('/menu', createMenu);

// Cập nhật một menu theo ID
router.put('/menu/:id', updateMenuById);

// Lấy tất cả các menu
router.get('/menu', getAllMenus);

// Lấy một menu theo ID
router.get('/menu/:id', getMenuById);

// Xóa một menu theo ID
router.delete('/menu/:id', deleteMenu);
// Slider routes
const SliderController = require('../controllers/Admin/Slider/SliderController');
router.get('/slider',  SliderController.getAllSliders);
router.post('/slider',upload.single('image'), SliderController.createSlider);
router.put('/slider/:id',  upload.single('image'), SliderController.updateSlider);
router.delete('/slider/:id', SliderController.deleteSlider);

module.exports = router;
