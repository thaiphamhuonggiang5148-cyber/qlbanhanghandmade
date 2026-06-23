import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "../Banner/Banner";
import ProductCard from "../Products/ProductCard";
import { imageMap } from "../../utils/productImages";
import "./Home.css";

const jsonBase = import.meta.env.BASE_URL || "/";

const features = [
  {
    icon: "fas fa-heart",
    title: "Tâm Huyết Từng Món",
    desc: "Mỗi sản phẩm đều được chăm chút tỉ mỉ bởi đôi bàn tay của các nghệ nhân lành nghề.",
  },
  {
    icon: "fas fa-leaf",
    title: "Nguyên Liệu Tự Nhiên",
    desc: "Ưu tiên vật liệu thân thiện với môi trường, an toàn cho sức khỏe và bền vững với thời gian.",
  },
  {
    icon: "fas fa-wand-magic-sparkles",
    title: "Cá Nhân Hóa Độc Bản",
    desc: "Dịch vụ tùy chỉnh sản phẩm theo yêu cầu riêng, mang đậm dấu ấn cá nhân của bà.",
  },
  {
    icon: "fas fa-people-carry-box",
    title: "Kết Nối Nghệ Nhân",
    desc: "Hỗ trợ phát triển làng nghề truyền thống và gìn giữ những giá trị văn hóa tinh túy.",
  },
];

const stats = [
  { number: "5+", label: "Năm đam mê" },
  { number: "1.200+", label: "Sản phẩm độc bản" },
  { number: "50+", label: "Nghệ nhân đồng hành" },
  { number: "100%", label: "Tâm hồn gửi gắm" },
];

const categories = [
  { to: "/product?category=1", icon: "fas fa-shirt", name: "Phụ Kiện Dệt May", desc: "Túi, khăn và trang trí thủ công" },
  { to: "/product?category=2", icon: "fas fa-vase", name: "Gốm & Decor", desc: "Nghệ thuật gốm và vật phẩm trưng bày" },
  { to: "/product?category=3", icon: "fas fa-cannabis", name: "Sản Phẩm Thiên Nhiên", desc: "Nến thơm, xà phòng thảo mộc" },
  { to: "/product?category=4", icon: "fas fa-gift", name: "Quà Tặng Cá Nhân", desc: "Thiết kế riêng theo tên và sở thích" },
];

const processSteps = [
  { step: "01", icon: "fas fa-compass", title: "Khám Phá", desc: "Duyệt qua những bộ sưu tập thủ công đầy cảm hứng và chọn món đồ phù hợp với không gian của bà." },
  { step: "02", icon: "fas fa-pen-nib", title: "Tùy Chỉnh", desc: "Chia sẻ ý tưởng, chúng mình sẽ giúp bà thiết kế món quà độc nhất vô nhị." },
  { step: "03", icon: "fas fa-heart", title: "Chế Tác", desc: "Các nghệ nhân bắt đầu thực hiện với sự tỉ mỉ, kiên nhẫn và trọn vẹn yêu thương." },
  { step: "04", icon: "fas fa-box-open", title: "Gói Trọn Gửi Trao", desc: "Đóng gói bằng vật liệu bền vững và gửi đến tận tay bà trong sự nâng niu nhất." },
];

const testimonials = [
  { name: "Minh Anh", role: "Khách hàng yêu nghệ thuật", initials: "MA", stars: 5, text: "Mỗi món đồ từ SoulMade như có linh hồn. Cảm giác cầm trên tay sản phẩm thêu tay thật sự rất khác biệt, tinh tế và ấm áp." },
  { name: "Thanh Trúc", role: "Chủ quán cafe decor", initials: "TT", stars: 5, text: "Mình đặt bộ bình gốm tại SoulMade để decor quán. Khách ai đến cũng hỏi vì nét vẽ tay không thể tìm thấy ở các shop đại trà." },
  { name: "Hoàng Quân", role: "Tín đồ quà tặng handmade", initials: "HQ", stars: 5, text: "Dịch vụ khắc tên rất chu đáo. Mình làm quà tặng bạn gái và cô ấy cực kỳ xúc động. Một địa chỉ rất đáng tin cậy." },
];

const brands = ["Lụa Tơ Tằm", "Gốm Bát Tràng", "Sợi Tự Nhiên", "Tinh Dầu Thiên Nhiên", "Mây Tre Đan"];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${jsonBase}Products.json`);
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.map(item => ({ ...item, image: imageMap[item.imageKey] || item.image })).slice(0, 8));
        }
      } catch (error) { console.error("Lỗi tải sản phẩm:", error); } 
      finally { setIsLoading(false); }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-wrapper">
      <Banner />
      <div className="features-strip"><div className="features-grid">{features.map((f, i) => (<div key={i} className="feature-card"><div className="feature-icon"><i className={f.icon}></i></div><div className="feature-text"><h3>{f.title}</h3><p>{f.desc}</p></div></div>))}</div></div>
      <div className="stats-section"><div className="stats-inner">{stats.map((s, i) => (<div key={i} className="stat-item"><div className="stat-number">{s.number}</div><div className="stat-label">{s.label}</div></div>))}</div></div>
      
      <div className="home-section">
        <div className="section-header"><div className="section-label">Danh Mục Sản Phẩm</div><h2 className="section-title">Thủ Công <span>Tinh Tế</span></h2><p className="section-subtitle">Khám phá những bộ sưu tập được thổi hồn từ bàn tay nghệ nhân.</p></div>
        <div className="categories-grid">{categories.map((cat, i) => (<Link key={i} to={cat.to} className="cat-card"><div className="cat-icon-box"><i className={`cat-icon ${cat.icon}`}></i></div><div className="cat-info"><h3>{cat.name}</h3><p>{cat.desc}</p></div><i className="cat-arrow fas fa-chevron-right"></i></Link>))}</div>
      </div>

      <div className="home-section-bg">
        <div className="home-section">
          <div className="section-header"><div className="section-label">Được Yêu Thích</div><h2 className="section-title">Sản Phẩm <span>Độc Bản</span></h2></div>
          {isLoading ? <div className="loading-state"><div className="loading-spinner"></div><span>Đang tìm món quà phù hợp...</span></div> : <div className="products-grid">{featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}</div>}
          <div className="view-all-wrap"><Link to="/product" className="btn-view-all">Khám Phá Tất Cả <i className="fas fa-arrow-right"></i></Link></div>
        </div>
      </div>

      <div className="process-section">
        <div className="home-section">
          <div className="section-header"><h2 className="section-title">Quy Trình <span>4 Bước</span></h2></div>
          <div className="process-grid">{processSteps.map((step, i) => (<div key={i} className="process-step"><div className="step-number">{step.step}<div className="step-icon-overlay"><i className={step.icon}></i></div></div><h3>{step.title}</h3><p>{step.desc}</p></div>))}</div>
        </div>
      </div>

      <div className="home-section-bg">
        <div className="home-section">
          <div className="section-header"><h2 className="section-title">Khách Hàng <span>Nói Gì?</span></h2></div>
          <div className="testimonials-grid">{testimonials.map((t, i) => (<div key={i} className="testimonial-card"><div className="testimonial-stars">{Array.from({length: t.stars}).map((_,j) => <i key={j} className="fas fa-star"></i>)}</div><p className="testimonial-text">{t.text}</p><div className="testimonial-author"><div className="author-avatar">{t.initials}</div><div className="author-info"><h4>{t.name}</h4><span>{t.role}</span></div></div></div>))}</div>
        </div>
      </div>

      <div className="brands-section"><div className="brands-inner"><p className="brands-label"><i className="fas fa-handshake"></i>&nbsp; Nguyên Liệu & Nghệ Nhân</p><div className="brands-row">{brands.map((b, i) => <span key={i} className="brand-item">{b}</span>)}</div></div></div>
      <div className="hotline-bar"><div className="hotline-inner"><span className="hotline-text"><i className="fas fa-phone-volume"></i>&nbsp; Hotline thiết kế:</span><a href="tel:0909888888" className="hotline-number">0909 888 888</a><div className="hotline-divider"></div><span className="hotline-text"><i className="fas fa-comments"></i>&nbsp; Zalo hỗ trợ:</span><a href="tel:0909999999" className="hotline-number">0909 999 999</a></div></div>
      
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Bà Đã Sẵn Sàng <span>Sở Hữu</span> Món Đồ Thủ Công Riêng?</h2>
          <p className="cta-desc">Liên hệ SoulMade để cùng chúng mình "thổi hồn" vào món quà tặng độc bản dành riêng cho bà.</p>
          <div className="cta-buttons"><Link to="/quote" className="btn-primary-lg"><i className="fas fa-pen-nib"></i> Đặt Hàng</Link><Link to="/contact" className="btn-outline-lg"><i className="fas fa-heart"></i> Liên Hệ</Link></div>
        </div>
      </div>
    </div>
  );
};

export default Home;