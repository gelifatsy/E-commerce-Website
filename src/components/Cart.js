import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { auth, fs } from "../Config/Config";
import CartProducts from "./CartProducts";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "./Modal";

toast.configure();

const Cart = () => {
  // show modal state
  const [showModal, setShowModal] = useState(false);

  //Trigger Modal

  const triggerModal = () => {
    setShowModal(true);
  };

  //hide modal
  const hideModal = () => {
    setShowModal(false);
  };

  function GetCurrentUser() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("users")
            .doc(user.uid)
            .get()
            .then((snapshot) => {
              setUser(snapshot.data().FullName); //we get the user here and we need to pass it to navbar as props
            });
        } else {
          setUser(null);
        }
      });
    }, []);
    return user;
  }

  const user = GetCurrentUser();
  // console.log(user);
  //state of the Cart products
  const [cartProducts, setCartProducts] = useState([]);

  //getting Cart products from firestore collection and updating the state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
        });
      } else {
        console.log("User is not sighed in");
      }
    });
  }, []);

  //getting the quantity of Cart products in separate array
  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });
  // reducing the quantity in a single value

  const reducerOfQty = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalQty = qty.reduce(reducerOfQty, 0);

  //getting the price of Cart products in separate array
  const price = cartProducts.map((cartProduct) => {
    return cartProduct.totalProductPrice;
  });

  // reducing the price in a single value

  const reducerOfPrice = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalPrice = price.reduce(reducerOfPrice, 0);

  //global variable
  let Product;

  // cart product incerease function
  const cartProductIncrease = (cartProduct) => {
    // console.log(cartProduct);
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.totalProductPrice = Product.qty * Product.price;

    //update the firestore collection
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid)
          .doc(cartProduct.ID)
          .update(Product)
          .then(() => {
            console.log("Incremented");
          });
      } else {
        console.log("user isn't logged in");
      }
    });
  };
  //cart product decrease
  const cartProductDecrease = (cartProduct) => {
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.totalProductPrice = Product.qty * Product.price;

      //update the firestore collection
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("Cart " + user.uid)
            .doc(cartProduct.ID)
            .update(Product)
            .then(() => {
              console.log("Decremented");
            });
        } else {
          console.log("user isn't logged in");
        }
      });
    }
  };
  //length of Cart to be displayed on navBar
  const [totalProducts, setTotalProducts] = useState(0);
  // getting user Cart length to display on cart logo
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
          const qty = snapshot.docs.length;
          setTotalProducts(qty);
        });
      }
    });
  }, []);
  // charging payment
  const navigate = useNavigate();

  const handleToken = async (token) => {
    //  console.log(token);
    const cart = { name: "All Products", totalPrice };
    const response = await axios.post("http://localhost:8080/checkout", {
      token,
      cart,
    });
    //console.log(response);
    let { status } = response.data;
    console.log(status);
    if ((status = "success")) {
      navigate("/");
      toast.success("Your order has been placed successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      const uid = auth.currentUser.uid;
      const carts = await fs.collection("Cart " + uid).get();
      for (var snap of carts.docs) {
        fs.collection("Cart " + uid)
          .doc(snap.id)
          .delete();
      }
    } else {
      alert("Something went wrong in checkout");
    }
  };

  return (
    <div>
      <div>
        <Navbar user={user} totalProducts={totalProducts} />
        <br />
        {cartProducts.length > 0 && (
          <div className="container-fluid flex">
            <h1 className="text-center">Cart</h1>
            <div className="products-box">
              <CartProducts
                cartProducts={cartProducts}
                cartProductIncrease={cartProductIncrease}
                cartProductDecrease={cartProductDecrease}
              />
            </div>
            <div className="summary-box">
              <h5>Cart Summary</h5>
              <br />
              <div>
                Total No of produce <span>{totalQty}</span>
              </div>
              <div>
                Total Price to pay: <span>$ {totalPrice}</span>
              </div>
              <StripeCheckout
                stripeKey="pk_test_51LzK4CErbhToF1iQGGOiSNcqPMT5sSFdfsCKsO0xvAlXLkf1TLyMRB7UqBwPAFdS9Nx6UPaLLwVARcUuw582Bj6000K83CIP3P"
                token={handleToken}
                billingAddress
                shippingAddress
                name="All products"
                amount={totalPrice * 100} //if we don't multiply it by 100 it wont show the exact amount
              ></StripeCheckout>
              <h6 className="text-center" style={{ marginTop: 7 + "px" }}>
                Or
              </h6>
              <button
                className="btn btn-secondary btn-md"
                onClick={() => triggerModal()}
              >
                Cash On Delivery
              </button>
            </div>
          </div>
        )}
        {cartProducts.length < 1 && (
          <div className="container-fluid">No product to Show</div>
        )}
        {showModal === true && (
          <Modal
            TotalPrice={totalPrice}
            totalQty={totalQty}
            hideModal={hideModal}
          />
        )}
      </div>
    </div>
  );
};

export default Cart;
