import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../../img/logo.png';

const Footer = () => {
  return (
    <footer className="highlands-footer">
      <div className="footer-green-strip"></div>

      <div className="footer-hotline-bar">
        <div className="footer-hotline-bar__inner">
          <div className="footer-hotline-item">
            <i className="fas fa-phone-alt"></i>
            <div>
              <span className="footer-hotline-label">Hotline tư vấn</span>
              <a href="tel:19001234" className="footer-hotline-number">1900 5148</a>
            </div>
          </div>
          <div className="footer-hotline-divider" />
          <div className="footer-hotline-item">
            <i className="fas fa-truck"></i>
            <div>
              <span className="footer-hotline-label">Đặt hàng & vận chuyển</span>
              <a href="tel:19005678" className="footer-hotline-number">1900 1886</a>
            </div>
          </div>
          <div className="footer-hotline-divider" />
          <div className="footer-hotline-item">
            <i className="fas fa-clock"></i>
            <div>
              <span className="footer-hotline-label">Giờ làm việc</span>
              <span className="footer-hotline-number" style={{ fontSize: '14px' }}>7:00 – 20:00 · Thứ 2 – Chủ Nhật</span>
            </div>
          </div>
          <div className="footer-hotline-divider" />
          <div className="footer-hotline-item">
            <i className="fas fa-envelope"></i>
            <div>
              <span className="footer-hotline-label">Email hỗ trợ</span>
              <a href="mailto:support@spsm.vn" className="footer-hotline-number" style={{ fontSize: '13px' }}>support@spsm.vn</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-content">

        <div className="footer-left">
          <div className="footer-logo">
            <img src={logo} alt="SMade" className="footer-logo-img" />
          </div>
          <p className="footer-tagline">
            Sản phẩm chất lượng — <br />
            Giá tốt, mẫu mã đa dạng, uy tín tuyệt đối
          </p>
          <p className="footer-copyright">
            ©2026 SoulMade .<br />All rights reserved.
          </p>

          <div className="footer-contact-block">
            <div className="footer-contact-row">
              <i className="fas fa-map-marker-alt"></i>
              <span>Khu phố 6, phường Linh Trung, quận Thủ Đức, Ho Chi Minh City</span>
            </div>
            <div className="footer-contact-row">
              <i className="fas fa-warehouse"></i>
              <span>Kho hàng: Khu CN Hiệp Phước, Nhà Bè, TP.HCM</span>
            </div>
            <div className="footer-contact-row">
              <i className="fas fa-id-card"></i>
              <span>MST: 0312345678 · Sở KHĐT TP.HCM cấp</span>
            </div>
          </div>

          <div className="footer-badges">
            <div className="footer-badge"><i className="fas fa-shield-alt"></i> Bảo hành chính hãng</div>
            <div className="footer-badge"><i className="fas fa-undo"></i> Đổi trả 7 ngày</div>
            <div className="footer-badge"><i className="fas fa-truck-fast"></i> Giao toàn quốc</div>
          </div>
        </div>

        <div className="footer-middle">

          <div className="footer-column">
            <h3 className="footer-column-title">VỀ SOULMADE</h3>
            <ul className="footer-links">
              <li><Link to="/about">Giới thiệu công ty</Link></li>
              <li><Link to="/history">Lịch sử hình thành</Link></li>
              <li><Link to="/team">Đội ngũ nhân sự</Link></li>
              <li><Link to="/partners">Đối tác & nhà cung cấp</Link></li>
              <li><Link to="/policy">Chính sách bảo hành</Link></li>
              <li><Link to="/return">Chính sách đổi trả</Link></li>
              <li><Link to="/privacy">Bảo mật thông tin</Link></li>
              <li><Link to="/contact">Liên hệ hợp tác</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-column-title">DANH MỤC SẢN PHẨM</h3>
            <ul className="footer-links">
              <li><Link to="/product?cat=phu-kien-thoi-trang">Phụ kiện thời trang</Link></li>
              <li><Link to="/product?cat=tui-xach-vi">Túi xách & Ví</Link></li>
              <li><Link to="/product?cat=do-trang-tri">Đồ trang trí nhà cửa</Link></li>
              <li><Link to="/product?cat=do-gom-dat-set">Đồ gốm & Đất sét</Link></li>
              <li><Link to="/product?cat=nen-thom-tinh-dau">Nến thơm & Tinh dầu</Link></li>
              <li><Link to="/product?cat=do-len">Đồ len</Link></li>
              <li><Link to="/product?cat=do-da">Đồ da</Link></li>
              <li><Link to="/product?cat=trang-suc-thu-cong">Trang sức thủ công</Link></li>
              <li><Link to="/product?cat=tranh-thu-cong">Tranh thủ công</Link></li>
              <li><Link to="/product?cat=my-pham-qua-tang">Mỹ phẩm & Quà tặng</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-column-title">HỆ THỐNG & DỊCH VỤ</h3>
            <ul className="footer-links">
              <li><Link to="/stores">Hệ thống kho bãi</Link></li>
              <li><Link to="/delivery">Chính sách vận chuyển</Link></li>
              <li><Link to="/bulk">Báo giá mua sỉ</Link></li>
              <li><Link to="/project">Cung cấp theo công trình</Link></li>
              <li><Link to="/consult">Tư vấn vật liệu</Link></li>
              <li><Link to="/quote">Nhận báo giá nhanh</Link></li>
              <li><Link to="/invoice">Xuất hoá đơn VAT</Link></li>
              <li><Link to="/track">Tra cứu đơn hàng</Link></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3 className="footer-column-title">HỖ TRỢ KHÁCH HÀNG</h3>
            <ul className="footer-links">
              <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
              <li><Link to="/shipping">Chính sách vận chuyển</Link></li>
              <li><Link to="/payment">Phương thức thanh toán</Link></li>
              <li><Link to="/return">Chính sách đổi trả</Link></li>
              <li><Link to="/membership">Ưu đãi thành viên</Link></li>
            </ul>

            <h3 className="footer-column-title" style={{ marginTop: '24px' }}>GÓC SOULMADE</h3>
            <ul className="footer-links">
              <li><Link to="/blog">Chuyện nhà SoulMade</Link></li>
              <li><Link to="/workshop">Lớp học thủ công</Link></li>
              <li><Link to="/diy">Hướng dẫn tự làm (DIY)</Link></li>
            </ul>
          </div>

        </div>
        <div className="footer-right">
          <h3 className="footer-column-title">KẾT NỐI VỚI SOULMADE</h3>
          <div className="footer-social-icons">
            <a href="https://facebook.com" className="social-icon facebook" target="_blank" rel="noreferrer" title="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" className="social-icon instagram" target="_blank" rel="noreferrer" title="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" className="social-icon youtube" target="_blank" rel="noreferrer" title="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://tiktok.com" className="social-icon tiktok" target="_blank" rel="noreferrer" title="TikTok">
              <i className="fab fa-tiktok"></i>
            </a>
            <a href="https://zalo.me" className="social-icon zalo" target="_blank" rel="noreferrer" title="Zalo">
              <span style={{ fontWeight: 700, fontSize: '12px', letterSpacing: '-0.5px' }}>Zalo</span>
            </a>
          </div>

          <div className="footer-map">
            <p className="footer-map__label"><i className="fas fa-location-dot"></i> Showroom SoulMade</p>
            <iframe
              title="Bản đồ SoulMade"
              className="footer-map__iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.443577740284!2d106.80753077464645!3d10.870008857753587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0x67a33990664d46b7!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiAtIMSQSFFHIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1717209397000!5m2!1svi!2s"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a className="footer-map__link" href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
              Mở trong Google Maps
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-bar__inner">
          <p className="footer-bottom-copy">
            ©2026 <strong>SoulMade Handmade</strong> · Giấy phép ĐKKD số 0547838382
          </p>
          <div className="footer-bottom-links">
            <Link to="/terms">Điều khoản sử dụng</Link>
            <span>·</span>
            <Link to="/privacy">Bảo mật</Link>
            <span>·</span>
            <Link to="/sitemap">Sơ đồ trang</Link>
          </div>
          <div className="footer-bottom-payment">
            <span className="payment-label">Thanh toán:</span>
            <div className="payment-icons">
              <span className="pay-badge">Tiền mặt</span>
              <span className="pay-badge">Chuyển khoản</span>
              <span className="pay-badge">VNPAY</span>
              <span className="pay-badge">MoMo</span>
              <span className="pay-badge">ZaloPay</span>
            </div>
          </div>
        </div>
      </div>

      <a
        href="https://zalo.me/soulmade"
        target="_blank"
        rel="noopener noreferrer"
        className="footer-chat-icon"
        title="Nhắn tin Zalo với SoulMade"
      >
        <i className="fas fa-comment-dots"></i>
      </a>
    </footer>
  );
};

export default Footer;