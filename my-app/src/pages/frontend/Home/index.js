

import React from 'react';
import Slider from './slider';
import Banner from './banner';
import Cart from '../../../components/compomentsUI/cart';
import Category from '../Category';
import ProductList from '../Product/ProductList';

function Home() {
     document.title="Home"
    return ( 
<>
  
  {/* Cart */}

  {/* Slider */}
      <Slider
      />
  {/* Banner */}
 <Banner/>
  {/* Product */}
  <section className="bg0 p-t-23 p-b-130">
    <div className="container">
      <div className="p-b-10">
        <h3 className="ltext-103 cl5" style={{ fontFamily: 'Arial, sans-serif', fontSize: '28px', fontWeight: 'bold' }}>Sản phẩm mới</h3>
      </div>
 
     <ProductList></ProductList>
     
      {/* Pagination */}
    
    </div>
  </section>
  {/* Footer */}
 
  {/* Back to top */}
  <div className="btn-back-to-top" id="myBtn">
    <span className="symbol-btn-back-to-top">
      <i className="zmdi zmdi-chevron-up" />
    </span>
  </div>
  {/* Modal1 */}

 
</>




     );
}
 
export default Home;