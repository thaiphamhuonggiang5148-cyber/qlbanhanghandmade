import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProductList from "./components/Products/ProductList";
import DetailProduct from "./components/Products/DetailProduct";
import Cart from "./components/Pages/Cart";
import Login from "./components/Pages/Login";
import Signup from "./components/Pages/Signup";
import Profile from "./components/Pages/Profile";
import Favorites from "./components/Pages/Favorites";
import Admin from "./components/Pages/Admin";
import Banner from "./components/Banner/Banner";
import Quote from "./components/Pages/Quote";
import About from "./components/Pages/About";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="app-wrapper" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!isAdmin && <Header />}

      {!isAdmin && location.pathname === "/" && <Banner />}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/:id" element={<DetailProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}