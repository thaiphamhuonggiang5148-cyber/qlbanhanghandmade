import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Pages/Home";
import ProductList from "./components/Products/ProductList";
import DetailProduct from "./components/Products/DetailProduct";
import Cart from "./components/Pages/Cart";
import Profile from "./components/Pages/Profile";
import Favorites from "./components/Pages/Favorites";
import Admin from "./components/Pages/Admin";
import About from "./components/Pages/About";
import Checkout from "./components/Pages/Checkout";
import News from "./components/Pages/News";
import NewsDetail from "./components/Pages/NewsDetail";
import Contact from "./components/Pages/Contact";
import Loading from "./components/Pages/Loading";
import Banner from "./components/Banner/Banner";
import Login from "./components/Pages/Login";
import Signup from "./components/Pages/Signup";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [isFakeLoading, setIsFakeLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFakeLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isFakeLoading) {
    return <Loading />;
  }

  return (
    <div className="app-wrapper" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      {!isAdmin && <Header />}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/:id" element={<DetailProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/Contact" element={<Contact />} />
          <Route  path="/Banner" element={<Banner />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}