import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Quote.css';

const Quote = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    materials: '',
    note: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('/product.json'),
          axios.get('/Category.json')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bảng giá:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(res => setTimeout(res, 1000));
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', phone: '', materials: '', note: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.categoryid === parseInt(selectedCategory));

  const activeCategoryName = selectedCategory === 'all'
    ? 'Tất cả'
    : categories.find(c => c.id === parseInt(selectedCategory))?.name || '';

  return (
    <div className="q-page">
      {/* ── HERO HEADER ── */}
      <div className="q-hero">
        <div className="q-hero-inner">
          <span className="q-badge">Cập nhật hàng tuần</span>
          <h1 className="q-hero-title">Bảng Giá Vật Liệu Xây Dựng</h1>
          <p className="q-hero-sub">
            Giá mang tính chất tham khảo. Liên hệ trực tiếp để nhận báo giá chính xác nhất cho công trình của bạn.
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="q-body">
        {/* ── LEFT: TABLE ── */}
        <div className="q-left">
          {/* Category Tabs */}
          <div className="q-tabs">
            <button
              className={`q-tab ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`q-tab ${selectedCategory === String(cat.id) ? 'active' : ''}`}
                onClick={() => setSelectedCategory(String(cat.id))}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Table Card */}
          <div className="q-table-card">
            <div className="q-table-header">
              <div>
                <h2 className="q-table-title">{activeCategoryName}</h2>
                {!loading && (
                  <span className="q-count">{filteredProducts.length} sản phẩm</span>
                )}
              </div>
              <div className="q-update-tag">
                <span className="q-dot"></span>
                Giá hôm nay
              </div>
            </div>

            {loading ? (
              <div className="q-skeleton-wrap">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="q-skeleton-row">
                    <div className="q-sk q-sk-sm"></div>
                    <div className="q-sk q-sk-lg"></div>
                    <div className="q-sk q-sk-md"></div>
                    <div className="q-sk q-sk-md"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="q-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9.172 14.828 12 12m0 0 2.828-2.828M12 12 9.172 9.172M12 12l2.828 2.828M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                </svg>
                <p>Không có sản phẩm trong danh mục này.</p>
              </div>
            ) : (
              <div className="q-table-scroll">
                <table className="q-table">
                  <thead>
                    <tr>
                      <th className="col-stt">STT</th>
                      <th className="col-name">Tên vật liệu</th>
                      <th className="col-unit">Quy cách / ĐVT</th>
                      <th className="col-price">Đơn giá (VNĐ)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((item, index) => {
                      const defaultVariant = item.variants?.length > 0 ? item.variants[0] : null;
                      const unit = defaultVariant ? defaultVariant.name : '—';
                      const price = item.currentPrice
                        || (item.price ? `${item.price.toLocaleString('vi-VN')}đ` : null);

                      return (
                        <tr key={item.id} className="q-row">
                          <td className="col-stt td-stt">{index + 1}</td>
                          <td className="col-name td-name">{item.name}</td>
                          <td className="col-unit td-unit">{unit}</td>
                          <td className="col-price td-price">
                            {price
                              ? <span className="price-chip">{price}</span>
                              : <span className="price-contact">Liên hệ</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <p className="q-disclaimer">
              * Giá có thể thay đổi theo thời điểm và số lượng đặt hàng. Vui lòng xác nhận lại trước khi ký hợp đồng.
            </p>
          </div>
        </div>

        {/* ── RIGHT: FORM ── */}
        <div className="q-right">
          <div className="q-form-card">
            <div className="q-form-top">
              <div className="q-form-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-3 3-2-3z" />
                </svg>
              </div>
              <div>
                <h2 className="q-form-title">Yêu cầu báo giá</h2>
                <p className="q-form-sub">Phản hồi trong vòng 2 giờ làm việc</p>
              </div>
            </div>

            {submitted ? (
              <div className="q-success">
                <div className="q-success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3>Đã gửi thành công!</h3>
                <p>Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form className="q-form" onSubmit={handleSubmit}>
                <div className="q-field">
                  <label htmlFor="qf-name">Họ và tên / Công ty</label>
                  <input
                    id="qf-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nguyễn Văn A / Công ty TNHH..."
                    autoComplete="name"
                  />
                </div>

                <div className="q-field">
                  <label htmlFor="qf-phone">Số điện thoại</label>
                  <div className="q-input-wrap">
                    <span className="q-input-prefix">🇻🇳 +84</span>
                    <input
                      id="qf-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="9xx xxx xxx"
                      className="has-prefix"
                    />
                  </div>
                </div>

                <div className="q-field">
                  <label htmlFor="qf-materials">
                    Vật liệu cần báo giá
                    <span className="q-label-hint">Nhập tên hoặc chọn từ bảng bên trái</span>
                  </label>
                  <input
                    id="qf-materials"
                    type="text"
                    name="materials"
                    value={formData.materials}
                    onChange={handleChange}
                    required
                    placeholder="VD: Xi măng PCB40, Thép D10, Cát xây..."
                  />
                </div>

                <div className="q-field">
                  <label htmlFor="qf-note">
                    Ghi chú
                    <span className="q-label-optional">Không bắt buộc</span>
                  </label>
                  <textarea
                    id="qf-note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Số lượng, địa chỉ giao hàng, yêu cầu đặc biệt..."
                  />
                </div>

                <button type="submit" className="q-submit" disabled={submitting}>
                  {submitting ? (
                    <span className="q-spinner"></span>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      Gửi yêu cầu báo giá
                    </>
                  )}
                </button>

                <div className="q-trust">
                  <span>🔒 Thông tin được bảo mật tuyệt đối</span>
                  <span>·</span>
                  <span>📞 Hotline: 1900 xxxx</span>
                </div>
              </form>
            )}
          </div>

          {/* Contact quick links */}
          <div className="q-contact-chips">
            <a href="tel:1900xxxx" className="q-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.68 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.68A2 2 0 0 1 22 16.92z" />
              </svg>
              Gọi ngay
            </a>
            <a href="https://zalo.me" target="_blank" rel="noreferrer" className="q-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Zalo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;