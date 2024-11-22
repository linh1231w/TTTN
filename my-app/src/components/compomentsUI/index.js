import { Outlet } from "react-router-dom";
import Header from "./Header";

import Cart from "./cart";
import Footer from "./Footer";
import { Helmet } from "react-helmet";

function compomentsUI() {
    return (  
        <>
       
        <Header/>
        <Outlet />
        <Cart/>
        <Footer/>
    </>
    );
}

export default compomentsUI;