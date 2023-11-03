import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Products from "./Products";
import { auth, fs } from "../Config/Config";
import { useNavigate } from "react-router-dom";
import { IndividualFilteredProduct } from "./IndividualFilteredProduct";
import { useContext } from "react";
import Footer from "./Footer";
// import { useUserAuth } from "./BookContext";

const Home = () => {
  const navigate = useNavigate();
  // const { logOut, user } = useUserAuth();
  // getting current user uid
  function GetUserUid() {
    const [uid, setUid] = useState(null);

    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUid(user.uid);
        }
      });
    }, []);
    return uid;
  }
  const uid = GetUserUid();

  //getting current user
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

  const [products, setProducts] = useState([]);

  //function to get products
  const getProducts = async () => {
    const products = await fs.collection("Products").get(); //this will get all data on Products collection
    const productsArray = [];
    for (var snap of products.docs) {
      var data = snap.data();
      data.ID = snap.id;
      productsArray.push({ ...data });
      if (productsArray.length === products.docs.length) {
        setProducts(productsArray);
      }
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  //state of totalProduct
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

  // adding products to Cart
  let Product;
  const addToCart = (product) => {
    if (uid !== null) {
      Product = product;
      Product["qty"] = 1;
      Product["totalProductPrice"] = Product.qty * Product.price;
      // console.log(uid);
      fs.collection("Cart " + uid) // creates a collection named Cart followed by user id
        .doc(Product.ID)
        .set(Product)
        .then(() => {
          // console.log(product);
        });
    } else {
      navigate("/login"); // redirect to login page
    }
  };
  // categories list rendering using span tag
  const [spans] = useState([
    { id: "Biography", text: "Biography" },
    { id: "Sel-help", text: "Self Help" },
    { id: "Psychology", text: "Psychology" },
    { id: "History", text: "History" },
    { id: "Business", text: "Business" },
    { id: "ReligiousAndSpritual", text: "Religious & Spritual" },
    { id: "Fiction", text: "Fiction" },
    { id: "Medical", text: `Medical` },
    { id: "Children", text: "Children" },
    { id: "PoliticsAndSocial", text: "Political & Social" },
  ]);
  const [languages] = useState([
    { id: "English", text: "English" },
    { id: "Amharic", text: "Amharic" },
    { id: "Oromifaa", text: "Oromifaa" },
  ]);

  // active class state
  const [active, setActive] = useState("");

  // category state
  const [category, setCategory] = useState("");
  //language list
  const [language, setlanguage] = useState("");

  // handle change ... it will set category and active states
  const handleCatagory = (individualSpan) => {
    setActive(individualSpan.id);
    setCategory(individualSpan.text);

    filterCatagory(individualSpan.text);
  };
  const handleLanguage = (individualLanguages) => {
    setActive(individualLanguages.id);
    setlanguage(individualLanguages);
    filterLanguage(individualLanguages.text);
  };

  // filtered products state
  const [filteredProducts, setFilteredProducts] = useState([]);

  // filter function
  const filterCatagory = (text) => {
    if (products.length > 1) {
      const filter = products.filter((product) => product.category === text);
      // products.filter((product) => product.language === text);
      setFilteredProducts(filter);
    } else {
      console.log("no products to filter");
    }
  };
  const filterLanguage = (text) => {
    if (products.length > 1) {
      const filter =
        // products.filter((product) => product.category === text) ||
        products.filter((product) => product.language === text);
      setFilteredProducts(filter);
    } else {
      console.log("no products to filter");
    }
  };
  // handle search and filter searched product
  const [query, setQuery] = useState("");
  const handleQuery = (e) => {
    setQuery(e.target.value);
    console.log(query);
  };
  const handleSearchFilter = (e) => {
    if (e.key === "Enter") {
      const filter = products.filter((product) =>
        product.title.toLowerCase().includes(query)
      );
      setFilteredProducts(filter);
    }
  };

  // return to all products
  const returntoAllProducts = () => {
    setActive("");
    setCategory("");
    setlanguage("");
    setFilteredProducts([]);
    setQuery("");
  };
  return (
    <>
      <Navbar
        user={user}
        totalProducts={totalProducts}
        handleQuery={handleQuery}
        handleSearchFilter={handleSearchFilter}
      />
      <br></br>
      <div className="container-fluid filter-products-main-box">
        <div className="filter-box">
          <h6>Filter by Language</h6>
          {languages.map((individualLanguages, index) => (
            <span
              key={index}
              id={individualLanguages.id}
              onClick={() => handleLanguage(individualLanguages)}
              className={
                individualLanguages.id === active ? active : "deactive"
              }
            >
              {individualLanguages.text}
            </span>
          ))}
          <h6>Filter by category</h6>
          {spans.map((individualSpan, index) => (
            <span
              key={index}
              id={individualSpan.id}
              onClick={() => handleCatagory(individualSpan)}
              className={individualSpan.id === active ? active : "deactive"}
            >
              {individualSpan.text}
            </span>
          ))}
        </div>
        {filteredProducts.length > 0 && (
          <div className="my-products">
            <h1 className="text-center">{category}</h1>
            <a href="javascript:void(0)" onClick={returntoAllProducts}>
              Return to All Products
            </a>
            <div className="products-box">
              {filteredProducts.map((individualFilteredProduct) => (
                <IndividualFilteredProduct
                  key={individualFilteredProduct.ID}
                  individualFilteredProduct={individualFilteredProduct}
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>
        )}
        {filteredProducts.length < 1 && (
          <>
            {products.length > 0 && (
              <div className="my-products">
                <h1 className="text-center">All Products</h1>
                <div className="products-box">
                  <Products products={products} addToCart={addToCart} />
                </div>
              </div>
            )}
            {products.length < 1 && (
              <div className="my-products please-wait">Please wait...</div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;
