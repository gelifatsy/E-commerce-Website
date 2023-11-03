import React from "react";
import { FaEnvelope, FaHome, FaPhoneAlt, FaPrint } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-dark">
      <div className="container">
        <div className="row py-5 text-white">
          <div className="col-md-3 col-sm-3">
            <h4 className="text-warning">Abol Books</h4>
            <p>abol books</p>
          </div>
          <div className="col-md-3 col-sm-12">
            <h4 className="text-warning">Services</h4>
            <p>About</p>
            <p>Return Policy</p>
            <p>Customer Services</p>
            <p>Delivery Coverage</p>
          </div>
          <div className="col-md-3 col-sm-12">
            <h4 className="text-warning">Useful Links</h4>
            <p>Sitemap</p>
            <p>Shipping rate</p>
            <p>abol abol</p>
          </div>
          <div className="col-md-3 col-sm-12">
            <h4 className="text-warning">Address</h4>
            <FaHome className="me-2" /> Addis Ababa <br />
            <FaPhoneAlt className="me-2" /> +2519109909 <br />
            <FaEnvelope className="me-2" /> elias@gmail.com <br />
            <FaPrint className="me-2" /> 524185
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
