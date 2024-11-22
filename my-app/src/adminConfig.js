// adminConfig.js
import React from 'react';
import { Admin, Resource } from 'react-admin';

import { UserList } from './pages/Backend/Pages/UserList'; // Tạo hoặc điều chỉnh component này theo nhu cầu của bạn




import {
    PeopleOutlined,
    ShoppingCartOutlined,
    
  } from "@mui/icons-material";
import dataProvider from './pages/Backend/Service/customDataProvider';
import MyLoginPage from './pages/Backend/Pages/MyLoginPage';
import authProvider from './pages/Backend/authProvider';
import ComponentsAd from './components/CompomentAd';
import Dasboard from './pages/Backend/Dasboard';
import { ProductCreate, ProductList } from './pages/Backend/Pages/Product';



const AdminConfig = () => (
    <Admin 
    loginPage={MyLoginPage}
    dashboard={Dasboard} dataProvider={dataProvider}
    authProvider={authProvider}
    basename="/admin"
    >
    
        <Resource name="users" list={UserList} icon={PeopleOutlined} options={{ label: "Quản Lý Người Dùng" }} />
        <Resource name="product" list={ProductList} create={ProductCreate}  icon={ShoppingCartOutlined} options={{ label: "Quản Lý Sản phẩm" }} />
    </Admin>
);

export default AdminConfig;
