import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageMap } from '../../utils/productImages';
import axios from 'axios';
import './Cart.css';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';
const parsePrice = (priceStr) => parseFloat(priceStr?.toString().replace(/[^\d]/g, '')) || 0;
const jsonBase = import.meta.env.BASE_URL || '/';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherMessage, setVoucherMessage] = useState('');

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));
    } catch (error) {
      console.error('Lỗi khi đọc dữ liệu giỏ hàng:', error);
    }
  }, []);

  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
    if (appliedVoucher) validateVoucherCondition(newCart, appliedVoucher);
  };

  const handleQuantityChange = (productId, delta) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean);
    updateCart(updatedCart);
  };

  const handleVariantChange = (productId, newVariantName) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId && item.variants) {
        const selectedVariant = item.variants.find(v => v.name === newVariantName);
        if (selectedVariant) {
          return {
            ...item,
            selectedVariantName: selectedVariant.name,
            currentPrice: selectedVariant.price
          };
        }
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const removeItem = (productId) => {
    updateCart(cartItems.filter(item => item.id !== productId));
  };

  const subTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (parsePrice(item.currentPrice) * item.quantity), 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    if (appliedVoucher.type === 'fixed') return appliedVoucher.value;
    if (appliedVoucher.type === 'percent') return (subTotal * appliedVoucher.value) / 100;
    return 0;
  }, [subTotal, appliedVoucher]);

  const totalAmount = Math.max(subTotal - discountAmount, 0);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    try {
      const res = await fetch(`${jsonBase}Voucher.json`);
      const vouchers = await res.json();
      const v = vouchers.find(v => v.code === voucherCode.trim().toUpperCase());

      if (!v) {
        setVoucherMessage('Mã giảm giá không tồn tại.');
        setAppliedVoucher(null);
        return;
      }
      if (v.status !== 'active') {
        setVoucherMessage('Mã giảm giá đã bị khóa.');
        setAppliedVoucher(null);
        return;
      }
      if (v.used >= v.limit) {
        setVoucherMessage('Mã giảm giá này đã hết lượt sử dụng.');
        setAppliedVoucher(null);
        return;
      }
      if (subTotal < v.minOrder) {
        setVoucherMessage(`Đơn hàng phải từ ${formatPrice(v.minOrder)} để áp dụng.`);
        setAppliedVoucher(null);
        return;
      }
      setAppliedVoucher(v);
      setVoucherMessage('Áp dụng mã thành công!');
    } catch (error) {
      setVoucherMessage('Lỗi hệ thống khi kiểm tra mã.');
    }
  };

  const validateVoucherCondition = (currentCart, v) => {
    const currentSubTotal = currentCart.reduce((total, item) => total + (parsePrice(item.currentPrice) * item.quantity), 0);
    if (currentSubTotal < v.minOrder) {
      setAppliedVoucher(null);
      setVoucherMessage('Đã tự động gỡ mã giảm giá do không đủ giá trị đơn tối thiểu.');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        appliedVoucher,
        discountAmount,
        subTotal,
        totalAmount
      }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
          <button className="continue-shopping-btn primary" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Giỏ hàng của bạn</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => {
            const price = parsePrice(item.currentPrice);
            return (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image || imageMap[item.imageKey] || 'https://via.placeholder.com/150'} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>

                  {item.variants && item.variants.length > 0 && (
                    <select
                      className="cart-weight-dropdown"
                      value={item.selectedVariantName || item.variants[0].name}
                      onChange={(e) => handleVariantChange(item.id, e.target.value)}
                    >
                      {item.variants.map((variant, index) => (
                        <option key={index} value={variant.name}>
                          {variant.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <p className="cart-item-price">{item.currentPrice}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-item-quantity">
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>
                  <div className="cart-item-total"><p className="item-total-price">{formatPrice(price * item.quantity)}</p></div>
                  <button className="remove-item-btn" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Tổng kết đơn hàng</h2>

          <div className="voucher-section">
            <input
              type="text"
              className="voucher-input"
              placeholder="Nhập mã giảm giá..."
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
            />
            <button className="voucher-btn" onClick={handleApplyVoucher}>Áp dụng</button>
          </div>
          {voucherMessage && (
            <p className={`voucher-message ${appliedVoucher ? 'success' : 'error'}`}>
              {voucherMessage}
            </p>
          )}

          <div className="summary-row">
            <span>Tạm tính:</span>
            <span>{formatPrice(subTotal)}</span>
          </div>
          {appliedVoucher && (
            <div className="summary-row discount-row">
              <span>Giảm giá ({appliedVoucher.code}):</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="summary-row" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '8px' }}>
            <span style={{ fontWeight: 'bold' }}>Tổng tiền:</span>
            <span className="total-price">{formatPrice(totalAmount)}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>Thanh toán</button>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;