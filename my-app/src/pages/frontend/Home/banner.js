import React, { useState, useEffect } from "react";
import axios from "axios";
import BrandService from "../../../Service/BrandSV";

function Banner() {
  const [brands, setBrands] = useState([]);

 



  //goi api
  useEffect(() => {
      BrandService.getAll()
        .then(response => {
          setBrands(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }, []);

  return (
    <div className="sec-banner bg0 p-t-95 p-b-55">
      <div className="container">
        <div className="row">
          {/* Map qua các brand và hiển thị */}
          {brands.map((brand) => (
            <div className="col-md-6 p-b-30 m-lr-auto" key={brand.id}>
              <div className="block1 wrap-pic-w">
                <img src={`http://localhost:5011/api/admin${brand.image}`} alt={brand.name} />
                <a
                  href="#"
                  className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
                >
                  <div className="block1-txt-child1 flex-col-l">
                    <span className="block1-name ltext-102 trans-04 p-b-8">
                      {brand.name}
                    </span>
                    <span className="block1-info stext-102 trans-04">
                      {brand.metadesc}
                    </span>
                  </div>
                  <div className="block1-txt-child2 p-b-4 trans-05">
                    <div className="block1-link stext-101 cl0 trans-09">
                      Shop Now
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
