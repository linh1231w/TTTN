import React, { useState } from 'react';
import { Menu, Button } from 'antd';
import { DashboardOutlined, UserOutlined, ShoppingCartOutlined, MenuFoldOutlined, MenuUnfoldOutlined, AppstoreAddOutlined, FolderOutlined, MenuOutlined, PictureOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ collapsed, onCollapse }) => {

    const location = useLocation(); // Lấy thông tin URL hiện tại
    const [selectedKey, setSelectedKey] = useState('1'); // Key của menu item hiện tại

  // Cập nhật selectedKey khi URL thay đổi
  React.useEffect(() => {
    switch (location.pathname) {
      case '/':
        setSelectedKey('1');
        break;
      case '/users':
        setSelectedKey('2');
        break;
      case '/products':
        setSelectedKey('3');
        break;
        case '/brands':
        setSelectedKey('4');
        break;
        case '/categorys':
          setSelectedKey('5');
        break;
        case '/menus':
          setSelectedKey('6');
        break;
        case '/sliders':
          setSelectedKey('7');
          
        break;
      default:
        setSelectedKey('1'); // Mặc định chọn Dashboard nếu không khớp
    }
  }, [location.pathname]);
  return (
    <div style={{
        position: 'fixed', // Cố định sidebar
        height: '100vh',  // Chiều cao toàn bộ trang
        width: collapsed ? '80px' : '200px', // Điều chỉnh chiều rộng theo trạng thái collapsed
        backgroundColor: '#001529',
        transition: 'width 0.2s', // Hiệu ứng chuyển đổi khi mở/đóng sidebar
        overflow: 'auto', // Cho phép cuộn nếu nội dung vượt quá chiều cao
      }} >
      <Button
        type="text"
        onClick={() => onCollapse(!collapsed)}
        style={{
            
          fontSize: '16px',
          width: '100%',
          height: '64px',
          border: 0,
          backgroundColor: '#001529',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        mode="inline"
        theme="dark"
        defaultSelectedKeys={['1']}
        selectedKeys={[selectedKey]}
        style={{ height: 'calc(100vh - 64px)', borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/users">Tài khoản</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
          <Link to="/products">Sản phẩm</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<AppstoreAddOutlined />}>
          <Link to="/brands">Thương hiệu</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<FolderOutlined  />}>
          <Link to="/categorys">Danh Mục</Link>
        </Menu.Item>
        <Menu.Item key="6" icon={<MenuOutlined   />}>
          <Link to="/menus">Menu</Link>
        </Menu.Item>
        <Menu.Item key="7" icon={<PictureOutlined />}>
          <Link to="/sliders">Slider</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
