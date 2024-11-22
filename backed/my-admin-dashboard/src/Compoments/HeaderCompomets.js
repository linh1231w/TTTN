// HeaderComponent.js
import React from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const HeaderComponents = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Xóa token khỏi localStorage
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };

  return (
    <Header className="site-layout-background" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h1 style={{ color: 'white' }}>Admin</h1>
      <Button
        type="text"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        style={{ fontSize: '16px', color: 'white' }} // Điều chỉnh kích thước và màu sắc của biểu tượng
      />
    </Header>
  );
};

export default HeaderComponents;
