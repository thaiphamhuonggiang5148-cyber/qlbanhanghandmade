import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './News.css';

const newsData = [
  {
    id: 1,
    title: "Dự báo giá sắt thép xây dựng quý III/2026: Tiếp tục đà tăng hay bình ổn?",
    excerpt: "Theo các chuyên gia phân tích, giá sắt thép xây dựng trong nước dự kiến dao động trong biên độ hẹp trước áp lực từ nguồn cung nhập khẩu Trung Quốc. Nhu cầu hạ tầng cuối năm vẫn là yếu tố hỗ trợ giá tích cực.",
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
    title: "Moon VLXD chính thức trở thành nhà phân phối cấp 1 của Xi măng Hà Tiên",
    excerpt: "Lễ ký kết hợp tác chiến lược diễn ra tại trụ sở Hà Tiên 1, đánh dấu bước tiến quan trọng của Moon VLXD trong việc đưa xi măng chất lượng cao đến tay người tiêu dùng với mức giá ưu đãi nhất thị trường miền Nam.",
    category: "Sự kiện",
    date: "25/05/2026",
    author: "Moon Team",
    readTime: "4 phút",
    views: "876",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Kinh nghiệm chọn mua gạch ốp lát chuẩn phong thủy cho không gian nhà ở",
    excerpt: "Chọn gạch ốp lát không chỉ cần chú ý đến chất liệu, màu sắc hài hòa với kiến trúc mà còn phải phù hợp với bản mệnh gia chủ. Bài viết tổng hợp kinh nghiệm thực tế từ chuyên gia phong thủy và kỹ sư xây dựng.",
    category: "Kinh nghiệm",
    date: "20/05/2026",
    author: "Tư vấn viên",
    readTime: "7 phút",
    views: "2.4k",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Cập nhật bảng giá cát đá xây dựng mới nhất khu vực TP.HCM — Tháng 5/2026",
    excerpt: "Bảng giá chi tiết cát xây tô, cát san lấp, đá 1x2, đá 4x6 cập nhật từ các bãi khai thác lớn tại Đồng Nai và Bình Dương. Hỗ trợ nhà thầu dự toán chi phí chính xác, tránh đội giá trong thi công.",
    category: "Báo giá",
    date: "15/05/2026",
    author: "Phòng Kinh Doanh",
    readTime: "3 phút",
    views: "3.1k",
    image: "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "5 xu hướng vật liệu xây dựng xanh đang thay đổi ngành xây dựng Việt Nam",
    excerpt: "Gạch không nung, ngói năng lượng mặt trời, bê tông nhẹ CLC và kính tiết kiệm năng lượng đang dần thay thế vật liệu truyền thống. Xu hướng công trình xanh không còn là xa xỉ mà trở thành tiêu chuẩn mới.",
    category: "Xu hướng",
    date: "10/05/2026",
    author: "Kiến trúc sư",
    readTime: "6 phút",
    views: "1.8k",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Chương trình tri ân tháng 5: Mua vật tư — Tặng ngay voucher giảm giá 500K",
    excerpt: "Moon VLXD tung gói ưu đãi đặc biệt: giảm thẳng tiền mặt cho đơn hàng thép và xi măng từ 5 tấn, tặng voucher 500.000đ và miễn phí vận chuyển nội thành TP.HCM. Số lượng ưu đãi có hạn trong tháng.",
    category: "Khuyến mãi",
    date: "01/05/2026",
    author: "Moon Team",
    readTime: "2 phút",
    views: "4.5k",
    hot: true,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Quy trình kiểm tra chất lượng bê tông tươi ngay tại công trường thi công",
    excerpt: "Hướng dẫn đầy đủ các bước đo độ sụt (slump test), lấy mẫu thử nén và kiểm tra chứng từ xe bồn — giúp chủ nhà và giám sát công trình đảm bảo chất lượng phần thô đạt chuẩn kỹ thuật.",
    category: "Kinh nghiệm",
    date: "28/04/2026",
    author: "Kỹ sư Kết cấu",
    readTime: "8 phút",
    views: "2.1k",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "Bảo dưỡng bê tông sau đổ: Lịch trình tưới nước và phủ bạt đúng kỹ thuật",
    excerpt: "Bảo dưỡng không đúng cách là nguyên nhân hàng đầu gây nứt sàn và thấm dột. Tìm hiểu tần suất tưới nước theo từng ngày, nhiệt độ môi trường và các loại màng dưỡng ẩm được khuyến nghị.",
    category: "Kinh nghiệm",
    date: "22/04/2026",
    author: "Kỹ sư Giám sát",
    readTime: "6 phút",
    views: "1.5k",
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 9,
    title: "So sánh thép cuộn phi 6, phi 8 thương hiệu Hòa Phát, Pomina, VAS năm 2026",
    excerpt: "Phân tích chi tiết ký hiệu bề mặt, dung sai độ dày, giới hạn chảy và đặc tính cơ lý của các dòng thép cuộn phổ biến tại miền Nam — giúp nhà thầu lựa chọn vật tư đúng chuẩn với giá tốt nhất.",
    category: "Thị trường",
    date: "15/04/2026",
    author: "Phòng Vật tư",
    readTime: "7 phút",
    views: "2.8k",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 10,
    title: "Hướng dẫn thi công chống thấm tường ngoài nhà đúng kỹ thuật trước mùa mưa",
    excerpt: "Mùa mưa đến, xử lý thấm kịp thời bảo vệ kết cấu và nội thất. Khám phá vật liệu chống thấm Sika, Kova, Dulux và phương pháp thi công 3 lớp được các kỹ sư khuyến nghị cho tường ngoài.",
    category: "Kinh nghiệm",
    date: "10/04/2026",
    author: "Kỹ sư Xây dựng",
    readTime: "9 phút",
    views: "3.3k",
    image: "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 11,
    title: "Nhận diện xi măng giả và kém chất lượng: 7 dấu hiệu và cách kiểm tra nhanh",
    excerpt: "Xi măng giả đang lưu hành tại nhiều cơ sở bán lẻ nhỏ, tiềm ẩn nguy cơ sập đổ công trình. Chia sẻ 7 dấu hiệu nhận biết và 3 cách kiểm tra đơn giản tại hiện trường không cần thiết bị chuyên dụng.",
    category: "Thị trường",
    date: "05/04/2026",
    author: "Phòng Kiểm soát CL",
    readTime: "5 phút",
    views: "4.9k",
    hot: true,
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 12,
    title: "Giải pháp vật liệu thông minh cho nhà phố hẻm: Tối ưu diện tích, tiết kiệm chi phí",
    excerpt: "Nhà phố hẻm mặt tiền dưới 4m đòi hỏi lựa chọn vật liệu và kết cấu đặc biệt. Khám phá giải pháp gạch block AAC, panel bê tông nhẹ và khung thép nhẹ giúp giảm tải trọng và tăng diện tích sử dụng.",
    category: "Xu hướng",
    date: "01/04/2026",
    author: "Kiến trúc sư",
    readTime: "6 phút",
    views: "1.7k",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=600&auto=format&fit=crop"
  }
];

const videoData = [
  {
    id: 1,
    title: "Cận cảnh quy trình giao nhận và hạ hàng sắt thép tại công trình quận 2",
    date: "26/05/2026",
    views: "5.2k",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 2,
    title: "Hướng dẫn pha trộn bê tông đúng tỷ lệ cho móng nhà dân dụng 2 tầng",
    date: "15/05/2026",
    views: "3.8k",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 3,
    title: "Review thực tế gạch ốp lát Đồng Tâm 2026: Chất lượng, mẫu mã và giá bán",
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
          <h1 className="news-title">Trung Tâm<br />Thông Tin VLXD</h1>
          <p className="news-subtitle">
            Cập nhật nhanh biến động thị trường, báo giá vật liệu và kinh nghiệm
            thi công từ đội ngũ chuyên gia Moon VLXD.
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
