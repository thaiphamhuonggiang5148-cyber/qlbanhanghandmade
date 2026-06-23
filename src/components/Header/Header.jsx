import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import logoImage from '../../img/logo.png';

const Header = () => {
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateHeaderData = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(savedCart.reduce((sum, item) => sum + (item.quantity || 0), 0));
    };
    updateHeaderData();
    window.addEventListener('storage', updateHeaderData);
    return () => window.removeEventListener('storage', updateHeaderData);
  }, []);

  const productMenuItems = [
    { text: 'Phụ kiện thời trang', to: '/product?category=1' },
    { text: 'Túi xách & Ví', to: '/product?category=2' },
    { text: 'Đồ trang trí nhà cửa', to: '/product?category=3' },
    { text: 'Đồ Gốm & Đất sét', to: '/product?category=4' },
    { text: 'Nến thơm & Tinh dầu', to: '/product?category=5' },
    { text: 'Đồ len', to: '/product?category=6' },
    { text: 'Đồ da', to: '/product?category=7' },
    { text: 'Phụ kiện trang sức', to: '/product?category=8' },
    { text: 'Tranh thủ công', to: '/product?category=9' },
    { text: 'Mỹ phẩm thiên nhiên', to: '/product?category=10' },
    { text: 'Tất cả sản phẩm', to: '/product' }
  ];

  return (
    <header className="main-header">
      <div className="header-top-strip">
        <div className="header-container strip-content">
          <div className="strip-left">
            <i className="fas fa-truck"></i> Giao hàng toàn quốc | 
            <i className="fas fa-phone-alt" style={{marginLeft: '10px'}}></i> Hotline: <strong>1900 1886</strong>
          </div>
          <div className="strip-right">
            <span className="lang-active">VN</span> | <span className="lang-option">EN</span>
          </div>
        </div>
      </div>

      <div className="header-main-bar">
        <div className="header-container main-bar-content">
          <Link to="/" className="header-logo"><img src={logoImage} alt="SoulMade Logo" /></Link>
          
          <div className="header-search-wrapper">
            <form className="header-search-form" onSubmit={(e) => { e.preventDefault(); }}>
              <input type="text" placeholder="Tìm kiếm quà tặng..." className="search-input" />
              <button type="submit" className="search-button"><i className="fas fa-search"></i></button>
            </form>
          </div>

          <div className="header-user-actions">
            <div className="action-item" onClick={() => navigate('/favorites')}><i className="far fa-heart action-icon"></i></div>
            <div className="action-item" onClick={() => navigate('/cart')}>
              <i className="fas fa-shopping-cart action-icon"></i>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </div>
        </div>
      </div>

      <nav className="header-navigation">
        <div className="header-container nav-content">
          <Link to="/" className="nav-link">TRANG CHỦ</Link>
          <div className="nav-item-with-dropdown" onMouseEnter={() => setHoveredMenu('products')} onMouseLeave={() => setHoveredMenu(null)}>
            <Link to="/product" className="nav-link">SẢN PHẨM <i className="fas fa-chevron-down"></i></Link>
            {hoveredMenu === 'products' && (
              <div className="dropdown-menu">
                {productMenuItems.map((item, index) => (<Link key={index} to={item.to} className="dropdown-item">{item.text}</Link>))}
              </div>
            )}
          </div>
          <Link to="/about" className="nav-link">VỀ SOULMADE</Link>
          <Link to="/contact" className="nav-link">LIÊN HỆ</Link>
        </div>
      </nav>
    </header>
  );
};
export default Header;