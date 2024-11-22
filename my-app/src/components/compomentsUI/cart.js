import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import styled from 'styled-components';
import { getCart, updateCartItem, removeFromCart } from '../../Service/CartSV';


const QuantityButton = styled.button`
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  color: #495057;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e9ecef;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RemoveButton = styled.button`
  background-color: #dc3545;
  border: none;
  color: white;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px;
  &:hover {
    background-color: #c82333;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;

  .quantity {
    margin: 0 10px;
    font-size: 14px;
  }
`;

const CartItemInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();


  const fetchCart = async () => {
    try {
      const response = await getCart();
      console.log(response.CartItems);
      const token = localStorage.getItem('token');
      const cartItems = token ? response.CartItems : response.CartItems.CartItems || [];
      setCartItems(cartItems);
      calculateTotal(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
      setTotal(0);
    }
  };

  

  const calculateTotal = (items) => {

    const newTotal = items.reduce((sum, item) => {
      return sum + (item.Product.salePrice || item.Product.price) * item.quantity;
    }, 0);
    setTotal(newTotal);
  };

  useEffect(() => {
    fetchCart();
    window.addEventListener('cartUpdated', fetchCart);
    return () => {
      window.removeEventListener('cartUpdated', fetchCart);
    };
  }, []);

  const handleUpdateCartItem = async (id, quantity) => {
    console.log(quantity, id);

    try {
      await updateCartItem(id, quantity);
      fetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const handleRemoveFromCart = async (id) => {
    try {
      await removeFromCart(id);
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleViewCart = () => {
    navigate('/cart', { state: { cartItems, total } });
  };

  return (
    <div className="wrap-header-cart js-panel-cart">
      <div className="s-full js-hide-cart" />
      <div className="header-cart flex-col-l p-l-65 p-r-25">
        <div className="header-cart-title flex-w flex-sb-m p-b-8">
          <div className="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04 js-hide-cart" style={{ top: '10px',right : '10px'}}>
          
          </div>
          <span className="mtext-103 cl2" style={{fontFamily: 'Arial, sans-serif', fontSize: '2rem', fontWeight: 'bold', color: '#333', margin: '0 auto'}}>Giỏ hàng của bạn</span>
        </div>
        <div className="header-cart-content flex-w js-pscroll">
          {cartItems && cartItems.length > 0 ? (
            <ul className="header-cart-wrapitem w-full">
              {cartItems.map((item) => (
                <li key={item.id} className="header-cart-item flex-w flex-t m-b-12">
                  <div className="header-cart-item-img">
                    <img src={`http://localhost:5011/api/admin${item.Product.images.find(img => img.isMain).url}`} alt={item.Product.name} />
                  </div>
                  <div className="header-cart-item-txt p-t-8">
                    <a href="#" className="header-cart-item-name m-b-18 hov-cl1 trans-04">
                      {item.Product.name}
                    </a>
                    <CartItemInfo>
                      <span className="header-cart-item-info">
                        {formatPrice(item.Product.salePrice || item.Product.price)}
                      </span>
                      <QuantityControls>
                        <QuantityButton onClick={() => handleUpdateCartItem(localStorage.getItem('token') ? item.id : item.Product.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <FaMinus />
                        </QuantityButton>
                        <span className="quantity">{item.quantity}</span>
                        <QuantityButton onClick={() => handleUpdateCartItem(localStorage.getItem('token') ? item.id : item.Product.id, item.quantity + 1)} disabled={item.quantity >= item.Product.quantity}>
                          <FaPlus />
                        </QuantityButton>
                        <RemoveButton onClick={() => handleRemoveFromCart(localStorage.getItem('token') ? item.id : item.Product.id)}>
                          <FaTrash />
                        </RemoveButton>
                      </QuantityControls>
                    </CartItemInfo>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Giỏ hàng của bạn đang trống</p>
          )}
          <div className="w-full">
            <div className="header-cart-total w-full p-tb-40">Tổng cộng: {formatPrice(total)}</div>
            <div className="header-cart-buttons flex-w w-full">
              <button
                onClick={handleViewCart}
                className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10"
              >
                Xem giỏ hàng
              </button>
              <a
                href="/checkout"
                className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10"
              >
                Thanh toán
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;