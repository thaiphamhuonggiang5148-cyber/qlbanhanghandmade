import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/logo.png';

const Header = () => {
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Danh mục menu con cho đồ handmade
  const handmadeMenuItems = [
    { text: 'Quà tặng đan len', href: '/products/dan-len' },
    { text: 'Phụ kiện thủ công', href: '/products/phu-kien' },
    { text: 'Set quà tự làm (DIY)', href: '/products/diy' },
    { text: 'Thiệp trang trí', href: '/products/thiep' }
  ];

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) {
        setCartCount(0);
      } else {
        try {
          const cart = JSON.parse(savedCart);
          const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
          setCartCount(totalItems);
        } catch (error) {
          setCartCount(0);
        }
      }
    };

    const updateCurrentUser = () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (error) {
          setCurrentUser(null);
        }
      }
    };

    updateCartCount();
    updateCurrentUser();

    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('userUpdated', updateCurrentUser);
    window.addEventListener('storage', () => {
      updateCartCount();
      updateCurrentUser();
    });

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('userUpdated', updateCurrentUser);
    };
  }, []);

  return (
    <header className="phuclong-header">
      <div className="header-top-bar">
        <div className="header-top-content">
          <div className="header-delivery-info">
            <span className="delivery-text">Free Delivery</span>
            <i className="fas fa-heart delivery-icon" style={{ marginLeft: '5px', color: '#ff69b4' }}></i>
            <span className="delivery-phone"> 0918 865 148</span>
          </div>

          <div className="header-logo-container">
            <div className="phuclong-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <img src={logoImage} alt="SoulMade Logo" className="header-logo-image" />
            </div>
          </div>

          <div className="header-user-actions">
            <button className="login-link" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              {currentUser ? (currentUser.name || currentUser.user) : 'Đăng nhập'}
            </button>
            <span className="action-separator">|</span>
            <div className="language-selector">
              <span className="lang-active">VN</span>
              <span className="lang-separator"> | </span>
              <span className="lang-option">EN</span>
            </div>
            <button className="cart-button" onClick={() => navigate('/cart')}>
              <i className="fas fa-shopping-bag"></i>
              <span>Giỏ hàng</span>
              <span className="cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      <nav className="header-navigation">
        <div className="nav-content">
          <a href="/" className="nav-link">TRANG CHỦ</a>

          {/* FIX: Thêm dropdown cho SẢN PHẨM */}
          <div 
            className="nav-item-with-dropdown" 
            onMouseEnter={() => setHoveredMenu('handmade')} 
            onMouseLeave={() => setHoveredMenu(null)}
            style={{ position: 'relative' }} // Quan trọng để menu con bám theo
          >
            <a href="/products" className={`nav-link ${hoveredMenu === 'handmade' ? 'active' : ''}`}>
              SẢN PHẨM <i className="fas fa-chevron-down" style={{ fontSize: '10px', marginLeft: '5px' }}></i>
            </a>
            
            {hoveredMenu === 'handmade' && (
              <div className="dropdown-menu">
                {handmadeMenuItems.map((item, index) => (
                  <a key={index} href={item.href} className="dropdown-item">
                    {item.text}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="/combo" className="nav-link">COMBO QUÀ TẶNG</a>
          <a href="/promotions" className="nav-link">KHUYẾN MÃI</a>
          <a href="/about" className="nav-link">GIỚI THIỆU</a>
          <a href="/about-us" className="nav-link">VỀ CHÚNG TÔI</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;