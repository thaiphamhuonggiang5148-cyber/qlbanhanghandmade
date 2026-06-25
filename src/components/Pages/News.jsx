import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './News.css';

const newsData = [
  {
    id: 1,
    title: "Dự báo giá đồ handmade quý III/2026: Tiếp tục đà tăng hay bình ổn?",
    excerpt: "Theo các chuyên gia phân tích, giá đồ handmade trong nước dự kiến dao động trong biên độ hẹp trước áp lực từ nguồn cung nhập khẩu Trung Quốc. Nhu cầu quà tặng cuối năm vẫn là yếu tố hỗ trợ giá tích cực.",
    category: "Thị trường",
    date: "29/05/2026",
    author: "Admin",
    readTime: "5 phút",
    views: "1.2k",
    featured: true,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "SoulMade chính thức trở thành nhà phân phối cấp 1 của Xi măng Hà Tiên",
    excerpt: "Lễ ký kết hợp tác chiến lược diễn ra tại trụ sở Hà Tiên 1, đánh dấu bước tiến quan trọng của SoulMade trong việc đưa sản phẩm handmade chất lượng cao đến tay người tiêu dùng với mức giá ưu đãi nhất thị trường miền Nam.",
    category: "Sự kiện",
    date: "25/05/2026",
    author: "SoulMade Team",
    readTime: "4 phút",
    views: "876",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Kinh nghiệm chọn mua đồ handmade chuẩn phong thủy cho không gian nhà ở",
    excerpt: "Chọn đồ handmade không chỉ cần chú ý đến chất liệu, màu sắc hài hòa với kiến trúc mà còn phải phù hợp với bản mệnh gia chủ. Bài viết tổng hợp kinh nghiệm thực tế từ chuyên gia phong thủy và nghệ nhân.",
    category: "Kinh nghiệm",
    date: "20/05/2026",
    author: "Tư vấn viên",
    readTime: "7 phút",
    views: "2.4k",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Cập nhật bảng giá đồ handmade mới nhất khu vực TP.HCM — Tháng 5/2026",
    excerpt: "Bảng giá chi tiết các sản phẩm handmade từ các xưởng lớn tại Đồng Nai và Bình Dương. Hỗ trợ khách hàng dự toán chi phí chính xác, tránh đội giá trong mua sắm.",
    category: "Báo giá",
    date: "15/05/2026",
    author: "Phòng Kinh Doanh",
    readTime: "3 phút",
    views: "3.1k",
    image: "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "5 xu hướng đồ handmade xanh đang thay đổi ngành thủ công Việt Nam",
    excerpt: "Sản phẩm tái chế, đồ gỗ thủ công, vải nhuộm tự nhiên và gốm tiết kiệm năng lượng đang dần thay thế sản phẩm truyền thống. Xu hướng handmade xanh không còn là xa xỉ mà trở thành tiêu chuẩn mới.",
    category: "Xu hướng",
    date: "10/05/2026",
    author: "Nghệ nhân",
    readTime: "6 phút",
    views: "1.8k",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Chương trình tri ân tháng 5: Mua đồ handmade — Tặng ngay voucher giảm giá 500K",
    excerpt: "SoulMade tung gói ưu đãi đặc biệt: giảm thẳng tiền mặt cho đơn hàng từ 5 sản phẩm, tặng voucher 500.000đ và miễn phí vận chuyển nội thành TP.HCM. Số lượng ưu đãi có hạn trong tháng.",
    category: "Khuyến mãi",
    date: "01/05/2026",
    author: "SoulMade Team",
    readTime: "2 phút",
    views: "4.5k",
    hot: true,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop"
  }

];

const videoData = [
  {
    id: 1,
    title: "Cận cảnh quy trình giao nhận và hạ hàng đồ handmade tại cửa hàng quận 2",
    date: "26/05/2026",
    views: "5.2k",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 2,
    title: "Hướng dẫn pha chế màu nhuộm tự nhiên cho sản phẩm handmade",
    date: "15/05/2026",
    views: "3.8k",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 3,
    title: "Review thực tế đồ handmade SoulMade 2026: Chất lượng, mẫu mã và giá bán",
    date: "01/05/2026",
    views: "2.1k",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

const CATEGORIES = ["Tất cả", "Thị trường", "Sự kiện", "Kinh nghiệm", "Báo giá", "Xu hướng", "Khuyến mãi"];

const CATEGORY_COLORS = {
  "Thị trường":  "#e74c3c",
  "Sự kiện":     "#2980b9",
  "Kinh nghiệm": "#27ae60",
  "Báo giá":     "#e67e22",
  "Xu hướng":    "#8e44ad",
  "Khuyến mãi":  "#c0392b",
};


const News = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featuredArticle = newsData[0];
  const regularArticles = newsData.slice(1);

  const filteredArticles =
    activeCategory === "Tất cả"
      ? regularArticles
      : regularArticles.filter((a) => a.category === activeCategory);

  return (
    <div className="news-container">

     <div className="news-hero">
  <div className="news-hero-deco" />

  <div className="news-hero-text">
    <span className="news-hero-label">Tin Tức &amp; Sự Kiện</span>
    <h1 className="news-title">Trung Tâm<br />Thông Tin Handmade</h1>
    <p className="news-subtitle">
      Cập nhật nhanh xu hướng thị trường, báo giá sản phẩm handmade và kinh nghiệm
      chế tác từ đội ngũ chuyên gia SoulMade.
    </p>
    <div className="news-hero-stats">
      <div className="stat-item">
        <span className="stat-num">120+</span>
        <span className="stat-label">Bài viết</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-num">15k+</span>
        <span className="stat-label">Lượt đọc</span>
      </div>
      <div className="stat-divider" />
      <div className="stat-item">
        <span className="stat-num">7</span>
        <span className="stat-label">Chủ đề</span>
      </div>
    </div>
  </div>

  <div className="news-hero-featured">
    <Link to={`/news/${featuredArticle.id}`} className="featured-card-link">
      <article className="featured-article">
        <img src={featuredArticle.image} alt={featuredArticle.title} className="featured-img" />
        <div className="featured-overlay">
          <span
            className="featured-cat-badge"
            style={{ background: CATEGORY_COLORS[featuredArticle.category] }}
          >
            ⭐ Bài Nổi Bật
          </span>
          <h2 className="featured-title">{featuredArticle.title}</h2>
          <p className="featured-excerpt">{featuredArticle.excerpt}</p>
          <div className="featured-meta">
            <span><i className="far fa-calendar-alt" /> {featuredArticle.date}</span>
            <span><i className="far fa-clock" /> {featuredArticle.readTime}</span>
            <span><i className="far fa-eye" /> {featuredArticle.views}</span>
          </div>
        </div>
      </article>
    </Link>
  </div>
</div>

{/* ── FILTER ─────────────────────────── */}
<div className="news-filter-bar">
  {CATEGORIES.map((cat) => (
    <button
      key={cat}
      className={`filter-btn${activeCategory === cat ? ' active' : ''}`}
      onClick={() => setActiveCategory(cat)}
    >
      {cat}
    </button>
  ))}
</div>


      {/* ── SECTION HEADER ─────────────────── */}
      <div className="news-section-header">
        <h2 className="news-section-title">
          {activeCategory === "Tất cả" ? "Tất Cả Bài Viết" : activeCategory}
        </h2>
        <span className="news-count">{filteredArticles.length} bài viết</span>
      </div>

      {/* ── GRID ───────────────────────────── */}
      <div className="news-grid">
        {filteredArticles.map((article, index) => (
          <article
            key={article.id}
            className={`news-card${article.hot ? ' news-card--hot' : ''}`}
            style={{ '--i': index }}
          >
            <div className="news-image-wrapper">
              <span
                className="news-category"
                style={{ background: CATEGORY_COLORS[article.category] || 'var(--gold-500)' }}
              >
                {article.category}
              </span>
              {article.hot && <span className="news-hot-badge">🔥 Hot</span>}
              <img src={article.image} alt={article.title} className="news-image" loading="lazy" />
            </div>

            <div className="news-content">
              <div className="news-meta">
                <span><i className="far fa-calendar-alt" /> {article.date}</span>
                <span><i className="far fa-clock" /> {article.readTime}</span>
                <span className="views-count"><i className="far fa-eye" /> {article.views}</span>
              </div>

              <h2 className="news-card-title">
                <Link to={`/news/${article.id}`} style={{ color: 'inherit' }}>
                  {article.title}
                </Link>
              </h2>

              <p className="news-excerpt">{article.excerpt}</p>

              <div className="news-footer">
                <span className="news-author">
                  <span className="author-avatar">{article.author[0]}</span>
                  {article.author}
                </span>
                <Link to={`/news/${article.id}`} className="news-readmore">
                  Đọc tiếp <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="news-empty">
          <i className="far fa-newspaper" />
          <p>Không có bài viết nào trong chủ đề này.</p>
        </div>
      )}

      {/* ── VIDEO ──────────────────────────── */}
      <div className="video-section">
        <div className="news-section-header">
          <h2 className="news-section-title">Video Thực Tế</h2>
          <span className="news-count">{videoData.length} video</span>
        </div>
        <div className="video-grid">
          {videoData.map((video) => (
            <div key={video.id} className="video-card">
              <div className="video-player-wrapper">
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="video-info">
                <h3 className="video-card-title">{video.title}</h3>
                <div className="video-meta">
                  <span><i className="far fa-calendar-alt" /> {video.date}</span>
                  <span><i className="far fa-eye" /> {video.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default News;
