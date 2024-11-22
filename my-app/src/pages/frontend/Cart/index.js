import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import styled from 'styled-components';
import { getCart, updateCartItem, removeFromCart } from '../../../Service/CartSV';

const QuantityButton = styled.button`
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  color: #495057;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;

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
  font-family: 'Montserrat', sans-serif;
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
    font-family: 'Montserrat', sans-serif;
  }
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  transition: all 0.3s ease;
  font-family: 'Roboto', sans-serif;

  &:hover {
    background-color: #f8f9fa;
  }

  &.selected {
    background-color: #e9ecef;
    border-color: #007bff;
  }

  .icon {
    margin-right: 10px;
    font-size: 24px;
  }
`;

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const response = await getCart();
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
  }, []);

  const handleUpdateCartItem = async (id, quantity) => {
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

  const handleProceedToCheckout = () => {
    navigate('/checkout', { state: { cartItems, total } });
  };

  return (
    <div style={{marginTop: 100, fontFamily: 'Open Sans, sans-serif'}}>
      <div className="container">
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <a href="/" className="stext-109 cl8 hov-cl1 trans-04" style={{fontFamily: 'Lato, sans-serif'}}>
            Trang chủ
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true" />
          </a>
          <span className="stext-109 cl4" style={{fontFamily: 'Lato, sans-serif'}}>Giỏ hàng</span>
        </div>
      </div>
      <form className="bg0 p-t-75 p-b-85">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
              <div className="m-l-25 m-r--38 m-lr-0-xl">
                <div className="wrap-table-shopping-cart">
                  <table className="table-shopping-cart">
                    <tbody>
                      <tr className="table_head">
                        <th className="column-1" style={{fontFamily: 'Roboto, sans-serif'}}>Sản phẩm</th>
                        <th className="column-2"></th>
                        <th className="column-3" style={{fontFamily: 'Roboto, sans-serif'}}>Giá</th>
                        <th className="column-4" style={{fontFamily: 'Roboto, sans-serif'}}>Số lượng</th>
                        <th className="column-5" style={{fontFamily: 'Roboto, sans-serif'}}>Tổng</th>
                      </tr>
                      {cartItems.map((item) => (
                        <tr key={item.id} className="table_row">
                          <td className="column-1">
                            <div className="how-itemcart1">
                              <img src={`http://localhost:5011/api/admin${item.Product.images.find(img => img.isMain).url}`} alt={item.Product.name} />
                            </div>
                          </td>
                          <td className="column-2" style={{fontFamily: 'Lato, sans-serif'}}>{item.Product.name}</td>
                          <td className="column-3" style={{fontFamily: 'Lato, sans-serif'}}>{formatPrice(item.Product.salePrice || item.Product.price)}</td>
                          <td className="column-4">
                            <QuantityControls>
                              <QuantityButton onClick={() => handleUpdateCartItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                <FaMinus />
                              </QuantityButton>
                              <span className="quantity">{item.quantity}</span>
                              <QuantityButton onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)} disabled={item.quantity >= item.Product.quantity}>
                                <FaPlus />
                              </QuantityButton>
                              <RemoveButton onClick={() => handleRemoveFromCart(item.id)}>
                                <FaTrash />
                              </RemoveButton>
                            </QuantityControls>
                          </td>
                          <td className="column-5" style={{fontFamily: 'Lato, sans-serif'}}>{formatPrice((item.Product.salePrice || item.Product.price) * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
              <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                <h4 className="mtext-109 cl2 p-b-30" style={{fontFamily: 'Playfair Display, serif'}}>Tổng giỏ hàng</h4>
                <div className="flex-w flex-t p-t-27 p-b-33">
                  <div className="size-208">
                    <span className="mtext-101 cl2" style={{fontFamily: 'Roboto, sans-serif'}}>Tổng cộng:</span>
                  </div>
                  <div className="size-209 p-t-1">
                    <span className="mtext-110 cl2" style={{fontFamily: 'Roboto, sans-serif'}}>{formatPrice(total)}</span>
                  </div>
                </div>
               
              
                <button onClick={handleProceedToCheckout} className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer" style={{marginTop: '20px', fontFamily: 'Montserrat, sans-serif'}}>
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Cart;