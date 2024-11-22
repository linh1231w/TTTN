import { useEffect, useState } from "react";
import ProductService from "../../../Service/ProductSV";
import "./ProductList.css"; // Import the CSS file
import Modal from "../../../components/compomentsUI/Modal";
import Category from "../Category";
import CategoryService from "../../../Service/CategorySV";
import { CSSTransition } from 'react-transition-group';
import './modalAnimation.css'; 
function ProductList() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);
    useEffect(() => {
        ProductService.getAll()
            .then(response => {
                // Sort products by date (assuming there's a 'createdAt' field)
                const sortedProducts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                // Get the 8 most recent products
                const recentProducts = sortedProducts.slice(0, 8);
                setProducts(recentProducts);
                setFilteredProducts(recentProducts);
                setLoading(false);
            })
            .catch(error => {
                setError('Error fetching data');
                setLoading(false);
            });



            CategoryService.getAll()
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu danh mục:', error);
            });
    }, []);

    

    useEffect(() => {
        if (selectedCategory) {
            setFilteredProducts(products.filter(product => product.categoryId === selectedCategory));
        } else {
            setFilteredProducts(products);
        }
        setCurrentPage(1);
    }, [selectedCategory, products]);

    const handleQuickView = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };
    const categoryMap = new Map(categories.map(category => [category.id, category.name]));

    if (loading) {
        return null;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
        <Category onCategoryChange={handleCategoryChange} isHomePage={true}/>
        <div className="row isotope-grid">
            {filteredProducts.map(product => (
                <div key={product.id} className={`col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item ${categoryMap.get(product.categoryId) || ''}`}>
                    <div className="block2">
                        <div className="block2-pic hov-img0">
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
                                <a
                                    href={`/product/${product.id}`}
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
        {/* <div className="flex-c-m flex-w w-full p-t-38">
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
            </div> */}
        </>
    );
}

export default ProductList;
