import React, { useState, useEffect } from 'react';
import CategoryService from '../../Service/CategorySV';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedAbout, setExpandedAbout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategoryClick = (categoryId) => {
    const newUrl = `/product?category=${categoryId}`;
   
    navigate(newUrl, { replace: true });
    // Trigger a custom event to notify other components about the URL change
    window.dispatchEvent(new CustomEvent('urlChange', { detail: { categoryId } }));
    // Close all expanded categories
    setExpandedCategories({});
    // Close the sidebar
    const sidebar = document.querySelector('.js-sidebar');
    if (sidebar) {
      sidebar.classList.remove('show-sidebar');
    }
    const hideSidebarElements = document.querySelectorAll('.js-hide-sidebar');
    hideSidebarElements.forEach(element => {
      element.click();
    });
  };

  const renderCategories = (categories, parentId = 0) => {
    return categories
      .filter(category => category.parentId === parentId)
      .map(category => (
        <li key={category.id} className="p-b-13">
          <div className="d-flex align-items-center justify-content-between">
            <a onClick={(e) => {
                e.preventDefault();
                handleCategoryClick(category.id);
              }}
               className="stext-102 cl2 hov-cl1 trans-04" style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', cursor: 'default' }}>
              {category.name}
            </a>
            {categories.some(child => child.parentId === category.id) && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category.id);
                }}
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', marginLeft: 'auto',cursor: 'default' }}
              >
                {expandedCategories[category.id] ? '▲' : '▼'}
              </button>
            )}
          </div>
          {expandedCategories[category.id] && (
            <ul className="mt-2 ml-4">
              {renderCategories(categories, category.id)}
            </ul>
          )}
        </li>
      ));
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      // Handle logout logic here
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      // Redirect the user to the home page and reload
      window.location.reload();
    } else {
      // Navigate to login page
      window.location.href = '/login';
    }
  };


  return (
    <aside className="wrap-sidebar js-sidebar">
      <div className="s-full js-hide-sidebar" />
      <div className="sidebar flex-col-l p-4" style={{ maxWidth: '300px', backgroundColor: '#f8f9fa', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div className="flex-r w-full p-b-15">
          <div 
            className="fs-24 lh-10 cl2 p-2 pointer hov-cl1 trans-04 js-hide-sidebar" 
            style={{ borderRadius: '50%', backgroundColor: '#e9ecef' }}
            onClick={() => {
              const sidebar = document.querySelector('.js-sidebar');
              if (sidebar) {
                sidebar.classList.remove('show-sidebar');
              }
            }}
          >
            <i className="zmdi zmdi-close" />
          </div>
        </div>
        <div className="sidebar-content w-full js-pscroll">
          <h3 className="mb-4 font-weight-bold text-center" style={{ paddingBottom: '10px' }}>Danh Mục</h3>
          <ul className="sidebar-link w-full list-unstyled">
            {renderCategories(categories)}
          </ul>
          <div className="sidebar-gallery w-full my-4">
            <h4 className="mb-3 font-weight-bold" style={{cursor: 'default'}}>Gallery</h4>
            {/* ... (existing gallery code) ... */}
          </div>
          <div className="sidebar-about w-full">
            <h4 className="mb-3 font-weight-bold d-flex justify-content-between align-items-center">
              About Us
              <button 
                onClick={() => setExpandedAbout(!expandedAbout)}
                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '12px', }}
              >
                {expandedAbout ? '▲' : '▼'}
              </button>
            </h4>
            {expandedAbout && (
              <p className="text-muted">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                maximus vulputate hendrerit. Praesent faucibus erat vitae rutrum
                gravida. Vestibulum tempus mi enim, in molestie sem fermentum quis.
              </p>
            )}
          </div>
        </div>
        <div className="d-flex justify-content-center w-100 mt-4">
          <button 
            onClick={handleAuthAction}
            className="btn"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#000',
              color: '#fff',
              border: '2px solid #000',
              borderRadius: '5px',
              padding: '10px 20px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              width: '80%'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#fff';
              e.target.style.color = '#000';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#000';
              e.target.style.color = '#fff';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            {isLoggedIn ? 'Đăng xuất' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
