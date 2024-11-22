import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // Import CSS for Modal
import { createFlyingElement } from '../../utils/animation';
import { addToCart, getCart, updateCartItem } from '../../Service/CartSV';

const Modal = ({ show, onClose, product }) => {
  const [quantity, setQuantity] = useState(1);
  const modalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mainImageUrl, setMainImageUrl] = useState('');

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      const mainImageIndex = product.images.findIndex(image => image.ismain);
      setCurrentImageIndex(mainImageIndex >= 0 ? mainImageIndex : 0);
    }
  }, [product]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImageUrl(`http://localhost:5011/api/admin${product.images[currentImageIndex].url}`);
    }
  }, [currentImageIndex, product]);

  const handlePrevImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? product.images.length - 1 : prevIndex - 1));
    }
  };

  const handleNextImage = () => {
    if (product && product.images) {
      setCurrentImageIndex((prevIndex) => (prevIndex === product.images.length - 1 ? 0 : prevIndex + 1));
    }
  };

  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleChange = (event) => {
    const value = Math.max(1, Number(event.target.value));
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!modalRef.current || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Người dùng đã đăng nhập, gọi API thêm vào giỏ hàng
        const response = await addToCart(product.id, quantity);
        console.log('Thêm vào giỏ hàng thành công:', response);
      } else {
        // Người dùng chưa đăng nhập, lưu vào localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || { CartItems: [] };
        const existingItem = cart.CartItems.find(item => item.productId === product.id);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.CartItems.push({
            productId: product.id,
            quantity: quantity,
            Product: {
              id: product.id,
              name: product.name,
              price: product.price,
              salePrice: product.salePrice,
              images: product.images
            }
          });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Thêm vào giỏ hàng local thành công');
      }

      const cart = document.querySelector('.js-show-cart');
      if (cart) {
        const cartRect = cart.getBoundingClientRect();
        createFlyingElement(
          modalRef.current,
          cartRect.left,
          cartRect.top
        );
      }
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      // Có thể thêm logic cập nhật UI ở đây (ví dụ: hiển thị thông báo thành công)
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      setError('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!product || !product.images) return <div></div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div ref={modalRef} className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <div className="modal-images">
            <div className="image-list">
              {product.images.map((image, index) => (
                <div
                  className={`image-item ${currentImageIndex === index ? 'selected' : ''}`}
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={`http://localhost:5011/api/admin${image.url}`} alt={`Product Image ${index + 1}`} />
                </div>
              ))}
            </div>
            <div className="main-image-container">
              <button className="image-nav-btn prev-btn" onClick={handlePrevImage}>‹</button>
              <img src={mainImageUrl} alt="Main Product Image" className="main-image" />
              <button className="image-nav-btn next-btn" onClick={handleNextImage}>›</button>
            </div>
          </div>
          <div className="modal-details">
            <h4 className="product-title">{product.name}</h4>
            <span className="product-price">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(product.price)}
            </span>
            <p className="product-description">{product.description}</p>
            <div className="product-options">
              <div className="quantity">
                <div className="quantity-container">
                  <span className="quantity-label">Quantity:</span>
                  <button className="quantity-btn" onClick={handleDecrease}>-</button>
                  <input 
                    type="number" 
                    className="quantity-input" 
                    value={quantity} 
                    onChange={handleChange}
                  />
                  <button className="quantity-btn" onClick={handleIncrease}>+</button>
                </div>
              </div>
              <button className="add-to-cart" onClick={handleAddToCart}>Add to cart</button>
            </div>
            <div className="social-share">
              <a href="#" className="share-button" data-tooltip="Add to Wishlist">
                <i className="zmdi zmdi-favorite" />
              </a>
              <a href="#" className="share-button" data-tooltip="Facebook">
                <i className="fa fa-facebook" />
              </a>
              <a href="#" className="share-button" data-tooltip="Twitter">
                <i className="fa fa-twitter" />
              </a>
              <a href="#" className="share-button" data-tooltip="Google Plus">
                <i className="fa fa-google-plus" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
