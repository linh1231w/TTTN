import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Menu from '../../pages/frontend/Menu';
import { getCart } from '../../Service/CartSV';


const Header = () => {
  const cartIconRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false); //
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const updateCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const cartData = await getCart();
        const itemCount = cartData.CartItems.length;
        setCartItemCount(itemCount);
      } else {
        const localCart = JSON.parse(localStorage.getItem('cart')) || { CartItems: [] };
        const itemCount = localCart.CartItems.length;
        setCartItemCount(itemCount);
      }
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);


  const fetchProducts = (searchTerm) => {
    fetch(`http://localhost:5011/api/productt?searchKey=${encodeURIComponent(searchTerm)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setSearchResults(data);
        setShowSearchResults(true);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };


  useEffect(() => {
    if (searchTerm.trim() !== '') {
      fetchProducts(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  


  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Thực hiện tìm kiếm và cập nhật combinedData
    fetchProducts();
  };

  const handleProductClick = () => {
    // Đặt lại giá trị ô tìm kiếm về null
    setSearchTerm('');
    setShowSearchResults(false);
  };


  return (

    <>
       <header className="header-v3">
        {/* Header desktop */}
        <div className="container-menu-desktop trans-03">
          <div className="wrap-menu-desktop">
            <nav className="limiter-menu-desktop p-l-45">
              {/* Logo desktop */}
              <a href="#" className="logo">
                <img src="../../assets/images/icons/logo-02.png" alt="IMG-LOGO" />
              </a>
              {/* Menu desktop */}
    <Menu/>
              {/* Icon header */}
          
              <div className="wrap-icon-header flex-w flex-r-m h-full">
             
                <div className="flex-c-m h-full p-r-25 bor6">
                  <div
                   ref={cartIconRef}
                    className="icon-header-item cl0 hov-cl1 trans-04 p-lr-11 icon-header-noti js-show-cart"
                    data-notify={cartItemCount}
                  >
                    <i className="zmdi zmdi-shopping-cart" />
                  </div>
                </div>

                <div className="flex-c-m h-full p-lr-19">
                  <div className="icon-header-item cl0 hov-cl1 trans-04 p-lr-11 js-show-sidebar">
                    <i className="zmdi zmdi-menu" />
                  </div>
                </div>
               
              </div>
            </nav>
          </div>
        </div>
        {/* Header Mobile */}
        <div className="wrap-header-mobile">
          {/* Logo moblie */}
          <div className="logo-mobile">
            <a href="index.html">
              <img src="../assets/images/icons/logo-01.png" alt="IMG-LOGO" />
            </a>
          </div>
          {/* Icon header */}
          <div className="wrap-icon-header flex-w flex-r-m h-full m-r-15">
            <div className="flex-c-m h-full p-r-5">
              <div
                className="icon-header-item cl2 hov-cl1 trans-04 p-lr-11 icon-header-noti js-show-cart"
                data-notify={2}
              >
                <i className="zmdi zmdi-shopping-cart" />
              </div>
            </div>
          </div>
          {/* Button show menu */}
          <div className="btn-show-menu-mobile hamburger hamburger--squeeze">
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </div>
        </div>
        {/* Menu Mobile */}
        <div className="menu-mobile">
          <ul className="main-menu-m">
            <li>
              <a href="index.html">Home</a>
              <ul className="sub-menu-m">
                <li>
                  <a href="index.html">Homepage 1</a>
                </li>
                <li>
                  <a href="home-02.html">Homepage 2</a>
                </li>
                <li>
                  <a href="home-03.html">Homepage 3</a>
                </li>
              </ul>
              <span className="arrow-main-menu-m">
                <i className="fa fa-angle-right" aria-hidden="true" />
              </span>
            </li>
            <li>
              <a href="product.html">Shop</a>
            </li>
            <li>
              <a href="shoping-cart.html" className="label1 rs1" data-label1="hot">
                Features
              </a>
            </li>
            <li>
              <a href="blog.html">Blog</a>
            </li>
            <li>
              <a href="about.html">About</a>
            </li>
            <li>
              <a href="contact.html">Contact</a>
            </li>
          </ul>
        </div>
        {/* Modal Search */}
        <div className="modal-search-header flex-c-m trans-04 js-hide-modal-search">
          <button className="flex-c-m btn-hide-modal-search trans-04">
            <i className="zmdi zmdi-close" />
          </button>
          <form className="container-search-header">
            <div className="wrap-search-header">
              
            </div>
          </form>
        </div>
      </header>
      <Sidebar />
    </>
  );
};

export default Header;
