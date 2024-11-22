import About from "../pages/frontend/About";

import Cart from "../pages/frontend/Cart";
import Checkout from "../pages/frontend/Checkout";

import Home from "../pages/frontend/Home";
import Product from "../pages/frontend/Product";
import ProductDetail from "../pages/frontend/Product/ProductDetail";


const RouterPublic = [
    {path:'/',component:Home},
    {path:'/product',component:Product},
    {path:'/product/:id',component:ProductDetail},
    {path:'/cart',component:Cart},
    {path:'/checkout',component:Checkout},
   
    {path:'/about',component:About},


   
]
export default RouterPublic;