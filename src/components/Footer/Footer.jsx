import React from 'react';
import './Footer.css';
import logo from '../../img/logo.png';

const Footer = () => {
  return (
    <footer className="highlands-footer">
      <div className="footer-green-strip"></div>

      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo-box">
            <img src={logo} alt="SoulMade" className="footer-logo-img" />
          </div>
          <p className="footer-copyright">
            ©2025 SoulMade. All rights reserved
          </p>
        </div>

        <div className="footer-middle">
          <div className="footer-column">
            <h3 className="footer-column-title">VỀ SOULMADE</h3>
            <ul className="footer-links">
              <li><a href="/origin">Nguồn gốc</a></li>
              <li><a href="/services">Dịch vụ</a></li>
              <li><a href="/careers">Nghề Nghiệp</a></li>
              <li><a href="/contact">Liên hệ</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-column-title">HỆ THỐNG CỬA HÀNG</h3>
            <ul className="footer-links">
              <li><a href="/find-store">Tìm cửa hàng gần nhất</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-column-title">TIN TỨC</h3>
            <ul className="footer-links">
            </ul>
          </div>
        </div>

        <div className="footer-right">
          <h3 className="footer-column-title">THEO DÕI CHÚNG TÔI</h3>
          <div className="footer-social-icons">
            <a href="https://facebook.com" className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" className="social-icon" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://tiktok.com" className="social-icon" aria-label="TikTok">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>

          <div className="footer-map">
            <iframe
              title="Bản đồ địa điểm SoulMade"
              className="footer-map__iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.231248848046!2d106.80047917573667!3d10.870008857462002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1715392000000!5m2!1svi!2s"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              className="footer-map__link"
              href="https://maps.app.goo.gl/..."
              target="_blank"
              rel="noopener noreferrer"
            >
              Mở trong Google Maps
            </a>
          </div>
        </div>
      </div>

      <div className="footer-chat-icon" title="Chat với chúng tôi">
        <i className="fas fa-comment-dots"></i>
      </div>
    </footer>
  );
};

export default Footer;