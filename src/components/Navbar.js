import React from "react";
import Icon from "react-icons-kit";
import { Link } from "react-router-dom";
import logo from "../images/abol-logo.png";
import { shoppingCart } from "react-icons-kit/feather/shoppingCart";
// import { AiOutlineApple } from "react-icons-kit/ai/AiOutlineApple";
import { auth } from "../Config/Config";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Navbar = ({ user, totalProducts, handleQuery, handleSearchFilter }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate("/login");
    });
  };
  return (
    <div className="navbar">
      <div className="leftside">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          class="form-control"
          placeholder="Search your favorite book"
          onChange={handleQuery}
          // defaultValue=""
          onKeyDown={handleSearchFilter}
          tabIndex={0}
        />
        {/* <Icon icon={AiOutlineApple} size={20} /> */}
      </div>
      <div className="rightside">
        {!user && (
          <>
            <div>
              <Link className="navlink" to="signup">
                Sign Up
              </Link>
            </div>
            <div>
              <Link className="navlink" to="login">
                Login
              </Link>
            </div>
          </>
        )}
        {user && (
          <>
            <div>
              <Link className="navlink" to="/">
                {user}
              </Link>
            </div>
            <div className="cart-menu-btn">
              <Link className="navlink" to="/cart">
                <Icon icon={shoppingCart} size={20} />
              </Link>
              <span className="cart-indicator">{totalProducts}</span>
            </div>
            <div className="btn btn-danger btn-md" onClick={handleLogout}>
              LOGOUT
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
