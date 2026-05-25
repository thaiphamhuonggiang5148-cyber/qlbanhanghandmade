import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../Products/ProductCard";
import "./Favorites.css";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = () => {
      const savedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
      setFavorites(savedFavs);
    };
    
    loadFavorites();
    window.addEventListener("favoritesUpdated", loadFavorites);
    return () => window.removeEventListener("favoritesUpdated", loadFavorites);
  }, []);

  if (favorites.length === 0) {
    return (
      <div className="favorites-container">
        <div className="favorites-empty">
          <h2>Danh sách yêu thích đang trống</h2>
          <p>Hãy thêm sản phẩm bạn yêu thích để dễ dàng theo dõi nhé!</p>
          <button className="continue-shopping-btn primary" onClick={() => navigate('/')}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">Sản phẩm yêu thích ({favorites.length})</h1>
      
      <div className="favorites-grid">
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;