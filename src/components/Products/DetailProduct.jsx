import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './DetailProduct.css';

const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    if (!product) {
      fetch('/Products.json')
        .then(res => res.json())
        .then(data => setProduct(data.find(p => String(p.id) === String(id))));
    }
  }, [id, product]);

  if (!product) return <div>Đang tải dữ liệu...</div>;

  const v = product.variants ? product.variants[selectedIdx] : null;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = {
      ...product,
      id: `${product.id}-${selectedIdx}`, // Key duy nhất theo size
      name: `${product.name} (${v?.name})`,
      currentPrice: v?.price || product.currentPrice
    };
    cart.push({ ...cartItem, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    navigate('/cart');
  };

  return (
    <div className="detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Quay lại</button>
      <div className="detail-card">
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="detail-info">
          <h2>{product.name}</h2>
          <p className="current-price" style={{fontSize: '24px', color: '#347A5C', fontWeight: 'bold'}}>
            {v?.price || product.currentPrice}
          </p>
          <div className="detail-sizes">
            {product.variants?.map((variant, i) => (
              <button key={i} className={selectedIdx === i ? 'ram-ssd-tag active' : 'ram-ssd-tag'} onClick={() => setSelectedIdx(i)}>
                {variant.name}
              </button>
            ))}
          </div>
          <button className="buy-now-button" onClick={addToCart}>Mua ngay</button>
        </div>
      </div>
    </div>
  );
};
export default DetailProduct;