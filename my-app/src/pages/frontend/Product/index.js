import { useEffect, useState } from "react";
import ProductService from "../../../Service/ProductSV";
import'./index.css';
import Modal from "../../../components/compomentsUI/Modal";
import Category from "../Category/index";
import CategoryService from "../../../Service/CategorySV";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import './modalAnimation.css'; 
function Product() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams(location.search);
                const categoryId = queryParams.get('category');
                const response = await ProductService.getAll(categoryId);
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error fetching products. Please try again later.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [location.search]);

    

    useEffect(() => {
        if (selectedCategory) {
            setFilteredProducts(products.filter(product => product.categoryId === selectedCategory));
        } else {
            setFilteredProducts(products);
        }
        setCurrentPage(1);
    }, [selectedCategory, products]);


    console.log(filteredProducts)

    const handleQuickView = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        
    };
    const categoryMap = new Map(categories.map(category => [category.id, category.name]));

      // Tính toán các sản phẩm cần hiển thị
      const indexOfLastProduct = currentPage * productsPerPage;
      const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
      const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  
      // Tạo các nút phân trang
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
          pageNumbers.push(i);
      }
    if (loading) {
        return null;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div style={{ marginTop: 100, marginLeft: 'auto', marginRight: 'auto', maxWidth: '70%' }}>
        <Category onCategoryChange={handleCategoryChange} isHomePage={false} />
        <div className="row isotope-grid">
            {currentProducts .map(product => (
                <div key={product.id}   className={`col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item ${categoryMap.get(product.categoryId) || ''}`}>
                    <div className="block2">
                        <div className="block2-pic hov-img0" style={{ position: 'relative' }}>
                            {product.images && product.images.length > 0 ? (
                                <a  href={`/product/${product.id}`}>
                                    <img 
                                        src={`http://localhost:5011/api/admin${product.images.find(image => image.isMain)?.url || ''}`} 
                                        alt="IMG-PRODUCT" 
                                        className="product-image" 
                                    />
                                    <img 
                                        src={`http://localhost:5011/api/admin${product.images.find(image => !image.isMain)?.url || ''}`} 
                                        alt="IMG-PRODUCT-HOVER" 
                                        className="hover-image" 
                                    />
                                     {product.salePrice && (
                                        <div className="sale-star">
                                            -{Math.round((product.price - product.salePrice) / product.price * 100)}%
                                        </div>
                                    )}
                                    <style>
                                        {`
                                        @keyframes swing {
                                            0% { transform: rotate(0deg) scale(1); }
                                            25% { transform: rotate(15deg) scale(1.1); }
                                            50% { transform: rotate(0deg) scale(1); }
                                            75% { transform: rotate(-15deg) scale(1.1); }
                                            100% { transform: rotate(0deg) scale(1); }
                                        }
                                        .sale-star {
                                            position: absolute;
                                            top: -10px;
                                            right: -10px;
                                            width: 60px;
                                            height: 60px;
                                            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
                                            background-color: red;
                                            color: white;
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                            font-size: 12px;
                                            font-weight: bold;
                                            z-index: 1000;
                                            animation: swing 1.5s ease-in-out infinite;
                                            transform-origin: center;
                                            transition: all 0.3s ease;
                                        }
                                        .sale-star:hover {
                                            transform: scale(1.2);
                                            animation-play-state: paused;
                                        }
                                        `}
                                    </style>
                                </a>
                            ) : (
                                <div className="no-image">No Image Available</div>
                            )}
                            <button
                                onClick={() => handleQuickView(product)}
                                className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                            >
                                Quick View
                            </button>
                        </div>
                        <div className="block2-txt flex-w flex-t p-t-14">
                            <div className="block2-txt-child1 flex-col-l">
                                <a  href={`/product/${product.id}`}
                                    className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                                >
                                    {product.name}
                                </a>
                                {product.salePrice ? (
                                    <>
                                        <span className="stext-105 cl3" style={{ textDecoration: 'line-through', marginRight: '10px' }}>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(product.price)}
                                        </span>
                                        <span className="stext-105 cl3 sale-price" style={{ color: 'red' }}>
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(product.salePrice)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="stext-105 cl3">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(product.price)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
           <CSSTransition
          in={showModal}
          timeout={300}
          classNames="modal"
          unmountOnExit
        >
          <Modal show={showModal} onClose={handleCloseModal} product={selectedProduct} />
        </CSSTransition>
        </div>
        <div className="flex-c-m flex-w w-full p-t-38">
                {pageNumbers.map(number => (
                    <a
                        key={number}
                        href="#"
                        className={`flex-c-m how-pagination1 trans-04 m-all-7 ${currentPage === number ? 'active-pagination1' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(number);
                        }}
                    >
                        {number}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default Product;
