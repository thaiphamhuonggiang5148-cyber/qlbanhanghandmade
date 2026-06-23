import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const productsUrl = `${import.meta.env.BASE_URL}Products.json`;

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // State để theo dõi người dùng đang bấm nút khối lượng nào (mặc định 0)
  const [selectedVariant, setSelectedVariant] = useState(0);

  useEffect(() => {
    const checkFavorite = () => {
      const favs = JSON.parse(localStorage.getItem("favorites")) || [];
      setIsFavorite(favs.some((item) => item.id === product.id));
    };
    checkFavorite();
    window.addEventListener("favoritesUpdated", checkFavorite);
    return () => window.removeEventListener("favoritesUpdated", checkFavorite);
  }, [product.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favs.findIndex((item) => item.id === product.id);

    if (index >= 0) {
      favs.splice(index, 1);
    } else {
      favs.push(product);
    }

    localStorage.setItem("favorites", JSON.stringify(favs));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const handleBuy = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(productsUrl);
      if (!response.ok) throw new Error("Không thể tải thông tin sản phẩm");
      const data = await response.json();
      const matchedProduct = data.find((item) => item.id === product.id);
      if (!matchedProduct) throw new Error("Sản phẩm không tồn tại");
      navigate(`/product/${product.id}`, {
        state: { product: { ...matchedProduct, image: product.image } },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Xác định giá trị hiển thị dựa trên nút đang chọn
  const hasVariants = product.variants && product.variants.length > 0;
  const displayPrice = hasVariants ? product.variants[selectedVariant].price : product.currentPrice;
  const displayOriginal = hasVariants ? product.variants[selectedVariant].originalPrice : product.originalPrice;
  const displayDiscount = hasVariants ? product.variants[selectedVariant].discount : product.discount;

  return (
    <div className="product-card">
      <button 
        className={`favorite-btn ${isFavorite ? "active" : ""}`} 
        onClick={toggleFavorite}
        title="Yêu thích"
      >
        <i className={isFavorite ? "fas fa-heart" : "far fa-heart"}></i>
      </button>

      <div className="product-image-container">
        <img src={product.image || "https://via.placeholder.com/300x200"} alt={product.name} className="product-image"/>
      </div>
      
      <h3 className="product-name">{product.name}</h3>
      
      <div className="product-ram-ssd">
        {hasVariants ? (
          product.variants.map((variant, index) => (
            <button 
              key={index} 
              className={`ram-ssd-tag ${selectedVariant === index ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn click nhầm ra ngoài thẻ
                setSelectedVariant(index);
              }}
            >
              {variant.name}
            </button>
          ))
        ) : (
          <>
            {product.sizeS && <button className="ram-ssd-tag">{product.sizeS}</button>}
            {product.sizeM && <button className="ram-ssd-tag">{product.sizeM}</button>}
            {product.sizeL && <button className="ram-ssd-tag">{product.sizeL}</button>}
          </>
        )}
      </div>

      <div className="product-pricing">
        <div className="current-price">{displayPrice}</div>
        <div className="original-price-section">
          {displayOriginal && <span className="original-price">{displayOriginal}</span>}
          {displayDiscount && <span className="discount">{displayDiscount}</span>}
        </div>
      </div>

      <div className="product-rating-sales">
        <span className="rating"> ☆ {product.rating}</span>
        <span className="sales">Đã bán {product.sold}</span>
      </div>

      <button className="compare-button" onClick={handleBuy} disabled={isLoading}>
        {isLoading ? "Đang mở..." : "Mua"}
      </button>
      
      {error && <div className="error-text">{error}</div>}
    </div>
  );
};

export default ProductCard;