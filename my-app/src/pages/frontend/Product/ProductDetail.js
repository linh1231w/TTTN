import { useEffect, useState } from "react";
import ProductService from "../../../Service/ProductSV";
import { useParams } from "react-router-dom";
import './productdetail.css';
import Modal from "../../../components/compomentsUI/Modal";
import { CSSTransition } from 'react-transition-group';
import './modalAnimation.css'; 

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (id) {
      ProductService.getbyID(id)
        .then(response => {
          setProduct(response.data);
          const mainImage = response.data.images.find(image => image.isMain === true) || response.data.images[0];
          setMainImage(mainImage);
          document.title = response.data.name;

          // Fetch related products after setting the product
          return ProductService.getAll();
        })
        .then(response => {
          const currentProduct = response.data.find(p => p.id === parseInt(id));
          if (currentProduct && currentProduct.categoryId) {
            const filtered = response.data.filter(p => 
              p.id !== parseInt(id) && p.categoryId === currentProduct.categoryId
            );
            setRelatedProducts(filtered);
          }
        })
        .catch(error => {
          console.error('Error fetching product data:', error);
        });
    }
  }, [id]);

  
  const handleImageClick = (image) => {
    setMainImage(image);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex < relatedProducts.length - 4 ? prevIndex + 1 : prevIndex));
  };

  const handleDecreaseQuantity = () => {
    setQuantity(prevQuantity => Math.max(1, prevQuantity - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prevQuantity => Math.min(product.quantity, prevQuantity + 1));
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div style={{marginTop: 100}}>
        <div className="container">
          <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
            <a href="/" className="stext-109 cl8 hov-cl1 trans-04">
              Home
              <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true" />
            </a>
            <a href="/products" className="stext-109 cl8 hov-cl1 trans-04">
              {product.category?.name}
              <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true" />
            </a>
            <span className="stext-109 cl4">{product.name}</span>
          </div>
        </div>

        <section className="product-detail">
          <div className="container1 flex">
            <div className="left">
              <div className="main_image1" style={{ position: 'relative' }}>
                <img 
                  src={`http://localhost:5011/api/admin${mainImage?.url}`} 
                  alt={product.name} 
                  className="slide" 
                  style={{width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain'}}
                />
                {product.salePrice && (
                  <div className="sale-starr">
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
                  .sale-starr {
                    position: absolute;
                    top: -10px;
                    right: 120px;
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
                  .sale-starr:hover {
                    transform: scale(1.2);
                    animation-play-state: paused;
                  }
                  `}
                </style>
              </div>
              <div className="option flex" style={{marginTop: '20px'}}>
                {product.images.map((image, index) => (
                  <div 
                    key={index}
                    style={{
                      border: image.url === mainImage?.url ? '2px solid rgba(0, 0, 0, 0.3)' : 'none',
                      padding: '2px',
                      marginRight: '10px'
                    }}
                  >
                    <img 
                      src={`http://localhost:5011/api/admin${image.url}`} 
                      alt={`${product.name} - ${index + 1}`}
                      onClick={() => handleImageClick(image)}
                      style={{
                        cursor: 'pointer',
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="right">
              <h3>{product.name}</h3>
              {product.salePrice ? (
                <>
                  <h4 style={{textDecoration: 'line-through', color: '#999'}}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(product.price)}
                  </h4>
                  <h4 style={{color: '#e53637', fontWeight: 'bold'}}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(product.salePrice)}
                  </h4>
                </>
              ) : (
                <h4>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(product.price)}
                </h4>
              )}
              <p>{product.description}</p>
              <h5 style={{fontWeight: 'bold'}}>Chọn số lượng:</h5>
              <div className="quantity-selector" style={{ display: 'flex', alignItems: 'center' ,marginTop: '10px'}}>
              <button 
                className="quantity-btn minus" 
                style={{ 
                  padding: '8px 12px', 
                  fontSize: '16px', 
                  borderRadius: '4px 0 0 4px', 
                  border: '1px solid #ccc', 
                  background: '#ffffff', 
                  color: '#000000',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease'
                }}
                onClick={handleDecreaseQuantity}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
              >-</button>
                <input 
                  type="number" 
                  value={quantity} 
                  min="1" 
                  max={product.quantity}
                  className="quantity-input" 
                  onChange={handleQuantityChange}
                  style={{ 
                    width: '50px', 
                    textAlign: 'center', 
                    border: '1px solid #ccc', 
                    borderLeft: 'none', 
                    borderRight: 'none', 
                    padding: '8px 0' 
                  }} 
                />
                <button 
                  className="quantity-btn plus" 
                  style={{ 
                    padding: '8px 12px', 
                    fontSize: '16px', 
                    borderRadius: '0 4px 4px 0', 
                    border: '1px solid #ccc', 
                    background: '#ffffff', 
                    color: '#000000',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onClick={handleIncreaseQuantity}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#e0e0e0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                >+</button>
              </div>
              <button className="button1">Thêm vào giỏ hàng</button>
            </div>
          </div>
        </section>
     

        <section className="sec-relate-product bg0 p-t-45 p-b-105">
          <div className="container">
            <div className="p-b-45">
              <h3 className="ltext-106 cl5 txt-center" style={{
                fontFamily: 'Arial, sans-serif',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#333',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '20px'
              }}>Sản phẩm liên quan</h3>
            </div>
            <div className="wrap-slick2">
              <div className="slick2 d-flex justify-content-between align-items-center">
                <button onClick={handlePrev} disabled={currentIndex === 0}>
                  <i className="fa fa-chevron-left" aria-hidden="true"></i>
                </button>
                <div className="d-flex justify-content-start flex-wrap" style={{width: 'calc(100% - 60px)', overflow: 'hidden'}}>
                  <div style={{
                    display: 'flex', 
                    transition: 'transform 0.5s ease', 
                    transform: `translateX(-${currentIndex * 25}%)`,
                    width: `${Math.max(400, relatedProducts.length * 25)}%`
                  }}>
                    {relatedProducts.map((relatedProduct, index) => {
                      const mainImage = relatedProduct.images.find(img => img.isMain) || relatedProducts.images[0];
                      const secondaryImage = relatedProduct.images.find(img => !img.isMain) || relatedProducts.images[0];
                      
                      return (
                        <div key={index} className="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15" style={{flex: '0 0 25%', width: '25%', minWidth: '250px', marginBottom: '20px'}}>
                          <div className="block2">
                            <div 
                              className="block2-pic hov-img0" 
                              style={{width: '100%', paddingTop: '120%', position: 'relative', overflow: 'hidden'}}
                              onMouseEnter={(e) => {
                                e.currentTarget.querySelector('.secondary-image').style.opacity = '1';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.querySelector('.secondary-image').style.opacity = '0';
                              }}
                            >
                              {relatedProduct.salePrice && (
                                <div className="sale-star">
                                  -{Math.round((relatedProduct.price - relatedProduct.salePrice) / relatedProduct.price * 100)}%
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
                              <img 
                                src={`http://localhost:5011/api/admin${mainImage.url}`} 
                                alt={`${relatedProduct.name} - main`} 
                                style={{
                                  position: 'absolute',
                                  top: '0',
                                  left: '0',
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                              <img 
                                className="secondary-image"
                                src={`http://localhost:5011/api/admin${secondaryImage.url}`} 
                                alt={`${relatedProduct.name} - secondary`} 
                                style={{
                                  position: 'absolute',
                                  top: '0',
                                  left: '0',
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  opacity: '0',
                                  transition: 'opacity 0.3s ease'
                                }}
                              />
                              <a
                                // href={`/product/${relatedProduct.id}`}
                                className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04"
                                style={{position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)'}}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleQuickView(relatedProduct);
                                }}
                              >
                                Quick View
                              </a>
                            </div>
                            <div className="block2-txt flex-w flex-t p-t-14">
                              <div className="block2-txt-child1 flex-col-l ">
                                <a
                                  href={`/product/${relatedProduct.id}`}
                                  className="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                                >
                                  {relatedProduct.name}
                                </a>
                                {relatedProduct.salePrice ? (
                                  <>
                                    <span className="stext-105 cl3" style={{textDecoration: 'line-through', color: '#999'}}>
                                      {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                      }).format(relatedProduct.price)}
                                    </span>
                                    <span className="stext-105 cl3" style={{color: '#e53637', fontWeight: 'bold'}}>
                                      {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                      }).format(relatedProduct.salePrice)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="stext-105 cl3">
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                    }).format(relatedProduct.price)}
                                  </span>
                                )}
                              </div>
                              <div className="block2-txt-child2 flex-r p-t-3">
                                <a
                                  href="#"
                                  className="btn-addwish-b2 dis-block pos-relative js-addwish-b2"
                                >
                                  <img
                                    className="icon-heart1 dis-block trans-04"
                                    src="../assets/images/icons/icon-heart-01.png"
                                    alt="ICON"
                                  />
                                  <img
                                    className="icon-heart2 dis-block trans-04 ab-t-l"
                                    src="../assets/images/icons/icon-heart-02.png"
                                    alt="ICON"
                                  />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button onClick={handleNext} disabled={currentIndex >= relatedProducts.length - 4}>
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
        <CSSTransition
          in={showModal}
          timeout={300}
          classNames="modal"
          unmountOnExit
        >
          <Modal show={showModal} onClose={handleCloseModal} product={selectedProduct} />
        </CSSTransition>
        {/* <section className="product-comments bg-white p-t-45 p-b-105">
          <div className="container">
            <h2 className="comment-title" style={{
              fontFamily: 'Roboto, sans-serif',
              fontSize: '25px',
              fontWeight: '700',
              color: '#333',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '40px',
              textAlign: 'center',
              position: 'relative',
              paddingBottom: '15px',
              opacity: 0.7
            }}>
              Bình Luận Sản Phẩm
            </h2>
            
            <div className="fb-comments-container">
              <iframe
                src={`https://www.facebook.com/plugins/comments.php?href=${encodeURIComponent(window.location.href)}&width=100%&numposts=3`}
                width="100%"
                height="400"
                style={{border: 'none', overflow: 'hidden'}}
                scrolling="no"
                frameBorder="0"
                allowTransparency="true"
                allow="encrypted-media"
              ></iframe>
            </div>
          </div>
        </section> */}
      </div>

      <div className="btn-back-to-top" id="myBtn">
        <span className="symbol-btn-back-to-top">
          <i className="zmdi zmdi-chevron-up" />
        </span>
      </div>

    </>
  );
}

export default ProductDetail;