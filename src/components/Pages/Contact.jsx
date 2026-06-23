import React, { useEffect, useState } from 'react';
import './Contact.css';

// ── CONSTANTS ──────────────────────────────────────────────────────────────────
const MAX_MSG = 500;

const SUBJECT_OPTIONS = [
  'Đặt hàng sản phẩm thủ công',
  'Tư vấn thiết kế quà tặng',
  'Hợp tác với nghệ nhân',
  'Khiếu nại / Phản hồi chất lượng',
  'Thông tin tuyển dụng',
  'Vấn đề khác',
];

const INFO_CARDS = [
  {
    icon: 'fas fa-map-marker-alt',
    label: 'Xưởng Sản Xuất',
    value: '45/2 Đường Thủ Công\nQuận 1, TP.HCM',
  },
  {
    icon: 'fas fa-phone-alt',
    label: 'Hotline / Zalo',
    value: '1900 1886 \n0918865148',
  },
  {
    icon: 'fas fa-envelope',
    label: 'Email',
    value: 'spsm@soulmade.vn\ncare@soulmade.vn',
  },
  {
    icon: 'fas fa-clock',
    label: 'Giờ làm việc',
    value: 'Thứ 2 – Chủ nhật\n 7:00 Sáng – 20:00 Tối',
  },
];

const HERO_STATS = [
  { num: '5 năm',    label: 'Đam mê' },
  { num: '1.200+',   label: 'Sản phẩm hoàn thiện' },
  { num: '50+',      label: 'Nghệ nhân đồng hành' },
  { num: '15 phút',  label: 'Phản hồi nhanh' },
];

// ── VALIDATION ─────────────────────────────────────────────────────────────────
const validate = (data) => {
  const errs = {};
  if (!data.name.trim())
    errs.name = 'Vui lòng nhập họ và tên.';
  if (!data.phone.trim())
    errs.phone = 'Vui lòng nhập số điện thoại.';
  else if (!/^[0-9]{9,11}$/.test(data.phone.replace(/[\s.-]/g, '')))
    errs.phone = 'Số điện thoại không hợp lệ.';
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errs.email = 'Địa chỉ email không hợp lệ.';
  if (!data.subject)
    errs.subject = 'Vui lòng chọn chủ đề liên hệ.';
  if (!data.message.trim())
    errs.message = 'Vui lòng nhập nội dung tin nhắn.';
  return errs;
};

// ── COMPONENT ──────────────────────────────────────────────────────────────────
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', subject: '', message: '',
  });
  const [errors,       setErrors]       = useState({});
  const [isLoading,   setIsLoading]   = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setErrors({});
      setTimeout(() => setIsSubmitted(false), 6000);
    }, 1500);
  };

  const msgLen = formData.message.length;

  return (
    <div className="contact-page">

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="contact-hero">
        <div className="contact-hero-bar" />

        <div className="contact-hero-inner">
          <div className="hero-badge">
            <i className="fas fa-heart" /> Sẵn sàng lắng nghe
          </div>

          <h1>Liên hệ với <span>SoulMade</span></h1>

          <p className="contact-hero-sub">
            Đội ngũ SoulMade luôn sẵn sàng tư vấn về các sản phẩm thủ công, hỗ trợ cá nhân hóa 
            quà tặng và kết nối nghệ nhân. Phản hồi trong vòng{' '}
            <strong>15 phút</strong> trong giờ làm việc.
          </p>

          <div className="contact-quick-btns">
            <a href="tel:0909888888" className="quick-btn quick-btn--call">
              <i className="fas fa-phone-alt" /> Gọi ngay: 0909 888 888
            </a>
            <a
              href="https://zalo.me/0909888888"
              target="_blank"
              rel="noopener noreferrer"
              className="quick-btn quick-btn--zalo"
            >
              <i className="fas fa-comment-dots" /> Chat Zalo
            </a>
            <a href="mailto:hello@soulmade.vn" className="quick-btn quick-btn--email">
              <i className="fas fa-envelope" /> Gửi Email
            </a>
          </div>

          <div className="hero-stats">
            {HERO_STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="h-stat-divider" />}
                <div className="h-stat">
                  <span className="h-stat-num">{s.num}</span>
                  <span className="h-stat-label">{s.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFO STRIP ──────────────────────────────────────── */}
      <div className="contact-info-strip">
        {INFO_CARDS.map((card) => (
          <div key={card.label} className="info-strip-card">
            <div className="info-strip-icon">
              <i className={card.icon} />
            </div>
            <div className="info-strip-text">
              <h4>{card.label}</h4>
              <p>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="contact-main">
        <div className="contact-left">
          <div className="map-wrap">
            <iframe
              src="https://www.google.com/maps/embed" 
              allowFullScreen=""
              loading="lazy"
              title="Bản đồ SoulMade"
            />
          </div>

          <div className="contact-social-section">
            <h3>
              <i className="fas fa-share-alt" /> Kết nối cùng SoulMade
            </h3>
            <div className="social-links">
              <a href="https://facebook.com/soulmade" target="_blank" rel="noopener noreferrer" className="social-link fb">
                <i className="fab fa-facebook-f" /> Facebook
              </a>
              <a href="https://instagram.com/soulmade" target="_blank" rel="noopener noreferrer" className="social-link ig">
                <i className="fab fa-instagram" /> Instagram
              </a>
              <a href="https://zalo.me/soulmade" target="_blank" rel="noopener noreferrer" className="social-link zl">
                <i className="fas fa-comment-dots" /> Zalo OA
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          <div className="form-header">
            <div className="form-header-badge">
              <i className="fas fa-heart" /> Gửi tin nhắn tâm tình
            </div>
            <h2>Gửi tin nhắn cho SoulMade</h2>
            <p>
              Hãy chia sẻ mong muốn của bạn, chúng mình sẽ giúp bạn hiện thực hóa món đồ thủ công độc bản.
            </p>
          </div>

          <form className="c-form" onSubmit={handleSubmit} noValidate>
            <div className="c-row">
              <div className="c-field">
                <label htmlFor="name">Họ và tên <span className="c-req">*</span></label>
                <div className={`c-input-wrap${errors.name ? ' has-error' : ''}`}>
                  <i className="fas fa-user c-icon" />
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ví dụ: Nguyễn Văn A" />
                </div>
                {errors.name && <span className="c-error-text"><i className="fas fa-exclamation-circle" /> {errors.name}</span>}
              </div>

              <div className="c-field">
                <label htmlFor="phone">Số điện thoại <span className="c-req">*</span></label>
                <div className={`c-input-wrap${errors.phone ? ' has-error' : ''}`}>
                  <i className="fas fa-phone c-icon" />
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="0909 999 999" />
                </div>
                {errors.phone && <span className="c-error-text"><i className="fas fa-exclamation-circle" /> {errors.phone}</span>}
              </div>
            </div>

            <div className="c-field">
              <label htmlFor="email">Email</label>
              <div className={`c-input-wrap${errors.email ? ' has-error' : ''}`}>
                <i className="fas fa-envelope c-icon" />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" />
              </div>
            </div>

            <div className="c-field">
              <label htmlFor="subject">Chủ đề <span className="c-req">*</span></label>
              <div className={`c-input-wrap c-select-wrap${errors.subject ? ' has-error' : ''}`}>
                <i className="fas fa-tag c-icon" />
                <select id="subject" name="subject" value={formData.subject} onChange={handleChange}>
                  <option value="">-- Chọn chủ đề --</option>
                  {SUBJECT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              {errors.subject && <span className="c-error-text"><i className="fas fa-exclamation-circle" /> {errors.subject}</span>}
            </div>

            <div className="c-field">
              <label htmlFor="message">Nội dung <span className="c-req">*</span></label>
              <div className={`c-input-wrap c-input-wrap--ta${errors.message ? ' has-error' : ''}`}>
                <i className="fas fa-pen c-icon" />
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Bà muốn đặt món gì, hay cần tư vấn về chất liệu nào?" maxLength={MAX_MSG} />
              </div>
              <div className="c-textarea-footer">
                <span className={`c-char-count${msgLen >= MAX_MSG ? ' max' : msgLen > MAX_MSG * 0.85 ? ' warn' : ''}`}>{msgLen}/{MAX_MSG}</span>
              </div>
              {errors.message && <span className="c-error-text"><i className="fas fa-exclamation-circle" /> {errors.message}</span>}
            </div>

            <button type="submit" className="c-submit" disabled={isLoading}>
              {isLoading ? <> <span className="c-spinner" /> Đang gửi... </> : <> <i className="fas fa-heart" /> Gửi tin nhắn </>}
            </button>

            {isSubmitted && (
              <div className="c-success-msg">
                <i className="fas fa-check-circle" /> Cảm ơn bạn! SoulMade đã nhận được tin nhắn và sẽ liên hệ lại ngay.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;