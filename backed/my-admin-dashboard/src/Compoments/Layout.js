
import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Đảm bảo đường dẫn đúng
import HeaderComponents from './HeaderCompomets'; // Đảm bảo đường dẫn đúng

const { Sider, Content } = AntLayout; // Đúng cách import từ antd





const Layout = () => {
    const [collapsed, setCollapsed] = React.useState(false);
  
    return (
      <AntLayout style={{ display: 'flex', height: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme="dark"
          style={{ zIndex: 1, height: '100vh' }}
        >
          <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
        </Sider>
        <AntLayout style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <HeaderComponents />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              backgroundColor: '#fff',
              
            }}
          >
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    );
  };
  
  export default Layout;
  