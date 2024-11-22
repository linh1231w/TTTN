import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaMoneyBillWave, FaTruck } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import { getCart } from '../../../Service/CartSV';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

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

const UserInfoSection = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 5px;
  font-family: 'Roboto', sans-serif';
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
`;

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.cartItems && location.state.total) {
      setCartItems(location.state.cartItems);
      setTotal(location.state.total);
    } else {
      fetchCart();
    }
    fetchUserInfo();
  }, [location.state]);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      const cartItems = response.CartItems || [];
      setCartItems(cartItems);
      calculateTotal(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
      setTotal(0);
    }
  };

  const fetchUserInfo = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        setUserInfo({
          name: decodedToken.name || '',
          email: decodedToken.email || '',
          phone: decodedToken.phone || '',
          address: decodedToken.address || ''
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

  const calculateTotal = (items) => {
    const newTotal = items.reduce((sum, item) => {
      return sum + (item.Product.salePrice || item.Product.price) * item.quantity;
    }, 0);
    setTotal(newTotal);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán trước khi đặt hàng', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    try {
      const response = await axios.post('http://localhost:5011/api/order', {
        customerName: userInfo.name,
        customerEmail: userInfo.email,
        customerPhone: userInfo.phone,
        items: cartItems.map(item => ({
          productId: item.Product.id,
          quantity: item.quantity,
        })),
        totalAmount: total,
        paymentMethod: paymentMethod,
        shippingAddress: userInfo.address,
      });
      
      const { redirectUrl } = response.data;
      console.log(response.data);
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Error during payment:', error);
      toast.error('Có lỗi xảy ra trong quá trình thanh toán.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div style={{marginTop: 100, fontFamily: 'Open Sans, sans-serif'}}>
      <ToastContainer />
      <div className="container">
        <div className="bread-crumb flex-w p-l-25 p-r-15 p-t-30 p-lr-0-lg">
          <a href="/" className="stext-109 cl8 hov-cl1 trans-04" style={{fontFamily: 'Lato, sans-serif'}}>
            Trang chủ
            <i className="fa fa-angle-right m-l-9 m-r-10" aria-hidden="true" />
          </a>
          <span className="stext-109 cl4" style={{fontFamily: 'Lato, sans-serif'}}>Thanh toán</span>
        </div>
      </div>
      <form className="bg0 p-t-75 p-b-85" onSubmit={handlePlaceOrder}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
              <div className="m-l-25 m-r--38 m-lr-0-xl">
             
                <div className="wrap-table-shopping-cart">
                <h4 className="mtext-109 cl2 p-b-30" style={{
                    fontFamily: 'Playfair Display, serif',
                    textAlign: 'center',
                    fontSize: '2.5rem',
                    marginBottom: '2rem',
                    borderBottom: '2px solid #333',
                    paddingBottom: '1rem'
                  }}>
                    Thông Tin Sản Phẩm
                  </h4>
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
                          <td className="column-4" style={{fontFamily: 'Lato, sans-serif'}}>{item.quantity}</td>
                          <td className="column-5" style={{fontFamily: 'Lato, sans-serif'}}>{formatPrice((item.Product.salePrice || item.Product.price) * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <UserInfoSection>
                  <h4 className="mtext-109 cl2 p-b-30" style={{
                    fontFamily: 'Playfair Display, serif',
                    textAlign: 'center',
                    fontSize: '2.5rem',
                    marginBottom: '2rem',
                    borderBottom: '2px solid #333',
                    paddingBottom: '1rem'
                  }}>
                    Thông Tin Người Dùng
                  </h4>
                  <div style={{ display: 'grid', gap: '1rem', fontFamily: 'Roboto, sans-serif' }}>

                    <Input
                      type="text"
                      name="name"
                    
                      value={userInfo.name}
                      onChange={handleInputChange}
                      placeholder="Tên"
                      required
                      style={{ padding: '0.8rem', fontSize: '15px', fontFamily: 'Roboto, sans-serif' }}
                    />
                    <Input
                      type="email"
                      name="email"
                      value={userInfo.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                      style={{ padding: '0.8rem', fontSize: '15px', fontFamily: 'Roboto, sans-serif' }}
                    />
                    <Input
                      type="tel"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleInputChange}
                      placeholder="Số điện thoại"
                      required
                      style={{ padding: '0.8rem', fontSize: '15px', fontFamily: 'Roboto, sans-serif' }}
                    />
                    <Input
                      type="text"
                      name="address"
                      value={userInfo.address}
                      onChange={handleInputChange}
                      placeholder="Địa chỉ"
                      required
                      style={{ padding: '0.8rem', fontSize: '15px', fontFamily: 'Roboto, sans-serif' }}
                    />
                  </div>
                </UserInfoSection>
              </div>
            </div>
            <div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
              <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
              <h4 className="mtext-109 cl2 p-b-30" style={{
                    fontFamily: 'Playfair Display, serif',
                    textAlign: 'center',
                    fontSize: '2.5rem',
                    marginBottom: '2rem',
                    borderBottom: '2px solid #333',
                    paddingBottom: '1rem'
                  }}>
                   Tổng Đơn Hàng
                  </h4>
                <div className="flex-w flex-t p-t-27 p-b-33">
                  <div className="size-208">
                    <span className="mtext-101 cl2" style={{fontFamily: 'Roboto, sans-serif'}}>Tổng cộng:</span>
                  </div>
                  <div className="size-209 p-t-1">
                    <span className="mtext-110 cl2" style={{fontFamily: 'Roboto, sans-serif'}}>{formatPrice(total)}</span>
                  </div>
                </div>
                
                <h4 className="mtext-109 cl2 p-b-30" style={{fontFamily: 'Playfair Display, serif'}}>Phương thức thanh toán</h4>
                <PaymentOption 
                  className={paymentMethod === 'zalopay' ? 'selected' : ''}
                  onClick={(e) => { e.preventDefault(); handlePaymentMethodChange('zalopay'); }}
                >
                  <SiZalo className="icon" />
                  <span>Thanh toán ZaloPay</span>
                </PaymentOption>
                <PaymentOption 
                  className={paymentMethod === 'cash' ? 'selected' : ''}
                  onClick={(e) => { e.preventDefault(); handlePaymentMethodChange('cash'); }}
                >
                  <FaTruck className="icon" />
                  <span>Thanh toán khi nhận hàng</span>
                </PaymentOption>
              
                <button type="submit" className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer" style={{marginTop: '20px', fontFamily: 'Montserrat, sans-serif'}}>
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
