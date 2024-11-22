import React, { useState, useEffect, useRef } from 'react';
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import './index.css';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { syncCart } from '../../../Service/CartSV';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=vn`)
        .then(response => response.json())
        .then(data => {
          const addressSuggestions = data.map(item => item.display_name);
          setSuggestions(addressSuggestions);
        })
        .catch(error => {
          console.error('Lỗi khi tìm kiếm địa chỉ:', error);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion);
    setSuggestions([]);
  };

  const handleToggle = (isRegister) => {
    if (isRegister) {
      containerRef.current.classList.add("active");
    } else {
      containerRef.current.classList.remove("active");
    }
    setIsSignUp(isRegister);
    setName('');
    setEmail('');
    setPassword('');
    setAddress('');
    setSuggestions([]);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5011/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          address,
          roleIds: [2]
        }),
      });
      if (response.ok) {
        message.success('Đăng ký thành công');
        handleToggle(false);
        setName('');
        setAddress('');
      } else {
        message.error('Đăng ký thất bại');
      }
    } catch (error) {
      message.error('Lỗi khi gọi API: ' + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5011/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        message.success('Đăng nhập thành công');
        
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          try {
            await syncCart();
            message.success('Đồng bộ giỏ hàng thành công');
          } catch (error) {
            message.error('Lỗi khi đồng bộ giỏ hàng: ' + error.message);
          }
        }
        
        setIsAnimating(true);
      } else {
        message.error('Đăng nhập thất bại');
      }
    } catch (error) {
      message.error('Lỗi khi gọi API: ' + error.message);
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    in: {
      opacity: 1,
      scale: 1,
    },
    out: {
      opacity: 0,
      scale: 1.2,
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
       window.location.href = '/';
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, navigate]);

  return (
    <motion.div
      className="login-page"
      initial="initial"
      animate={isAnimating ? "out" : "in"}
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="login-container" ref={containerRef}>
        <div className="login-form-container login-sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Tạo Tài Khoản</h1>
            <div className="login-social-icons">
              <a href="#" className="icon"><FaGoogle /></a>
              <a href="#" className="icon"><FaFacebookF /></a>
              <a href="#" className="icon"><FaGithub /></a>
              <a href="#" className="icon"><FaLinkedinIn /></a>
            </div>
            <span>hoặc sử dụng email của bạn để đăng ký</span>
            <input type="text" placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Địa chỉ đầy đủ"
                value={address}
                onChange={handleAddressChange}
              />
              {suggestions.length > 0 && (
                <div style={{ position: 'absolute', width: '100%', zIndex: 1000, backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                  <ul className="address-suggestions" style={{ maxHeight: '190px', overflowY: 'auto', margin: 0, padding: 0, listStyle: 'none', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style>
                      {`
                        .address-suggestions::-webkit-scrollbar {
                          display: none;
                        }
                      `}
                    </style>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button type="submit">Đăng Ký</button>
          </form>
        </div>
        <div className="login-form-container login-sign-in">
          <form onSubmit={handleLogin}>
            <h1>Đăng Nhập</h1>
            <div className="login-social-icons">
              <a href="#" className="icon"><FaGoogle /></a>
              <a href="#" className="icon"><FaFacebookF /></a>
              <a href="#" className="icon"><FaGithub /></a>
              <a href="#" className="icon"><FaLinkedinIn /></a>
            </div>
            <span>hoặc sử dụng email và mật khẩu của bạn</span>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
            <a href="#">Quên mật khẩu?</a>
            <button type="submit">Đăng Nhập</button>
          </form>
        </div>
        <div className="login-toggle-container">
          <div className="login-toggle">
            <div className="login-toggle-panel login-toggle-left">
              <h1>Chào mừng trở lại!</h1>
              <p>Nhập thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web</p>
              <button className="hidden" onClick={() => handleToggle(false)}>Đăng Nhập</button>
            </div>
            <div className="login-toggle-panel login-toggle-right">
              <h1>Xin chào, Bạn!</h1>
              <p>Đăng ký với thông tin cá nhân của bạn để sử dụng tất cả các tính năng của trang web</p>
              <button className="hidden" onClick={() => handleToggle(true)}>Đăng Ký</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;