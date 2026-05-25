import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  // State lưu giá và thông tin variant đang được chọn
  const [selected, setSelected] = useState(product.variants?.[0] || {
    price: product.currentPrice,
    originalPrice: product.originalPrice,
    discount: product.discount
  });

  const handleBuy = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h3 className="product-name">{product.name}</h3>

      {/* Render nút size từ variants */}
      <div className="product-ram-ssd">
        {product.variants?.map((v, i) => (
          <button key={i} className="ram-ssd-tag" onClick={() => setSelected(v)}>
            {v.name.replace('Size ', '')}
          </button>
        ))}
      </div>

      <div className="product-pricing">
        <div className="current-price">{selected.price}</div>
        <div className="original-price-section">
          <span className="original-price">{selected.originalPrice}</span>
          <span className="discount">{selected.discount}</span>
        </div>
      </div>

      <button className="compare-button" onClick={handleBuy}>Mua ngay</button>
    </div>
  );
};
export default ProductCard;