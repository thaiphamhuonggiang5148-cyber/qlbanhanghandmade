import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageMap } from '../../utils/productImages';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                setCartItems([]);
            }
        }
    }, []);

    // HÀM QUAN TRỌNG: Làm sạch giá tiền
    // Nó sẽ biến "80.000₫" hay "118.000 đ" thành con số 80000 hoặc 118000
    const parsePrice = (priceStr) => {
        if (typeof priceStr === 'number') return priceStr;
        const cleanStr = String(priceStr).replace(/[^\d]/g, '');
        return parseInt(cleanStr, 10) || 0;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
    };

    const updateCart = (newCart) => {
        setCartItems(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const increaseQuantity = (productId) => {
        updateCart(cartItems.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const decreaseQuantity = (productId) => {
        updateCart(cartItems.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: Math.max(1, item.quantity - 1) };
            }
            return item;
        }));
    };

    const removeItem = (productId) => {
        updateCart(cartItems.filter(item => item.id !== productId));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (parsePrice(item.currentPrice) * item.quantity);
        }, 0);
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-container">
                <div className="cart-empty">
                    <h2>Giỏ hàng của bạn đang trống</h2>
                    <button className="continue-shopping-btn" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
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
                                    <p className="cart-item-price">{item.currentPrice}</p>
                                </div>
                                <div className="cart-item-quantity">
                                    <button className="quantity-btn" onClick={() => decreaseQuantity(item.id)}>-</button>
                                    <span className="quantity-value">{item.quantity}</span>
                                    <button className="quantity-btn" onClick={() => increaseQuantity(item.id)}>+</button>
                                </div>
                                <div className="cart-item-total">
                                    <p className="item-total-price">{formatPrice(price * item.quantity)}</p>
                                </div>
                                <button className="remove-item-btn" onClick={() => removeItem(item.id)}>×</button>
                            </div>
                        );
                    })}
                </div>
                <div className="cart-summary">
                    <h2 className="summary-title">Tổng kết đơn hàng</h2>
                    <div className="summary-row">
                        <span>Tổng tiền:</span>
                        <span className="total-price">{formatPrice(calculateTotal())}</span>
                    </div>
                    <button className="checkout-btn">Thanh toán</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;