import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./DetailProduct.css";
import { imageMap } from "../../utils/productImages";

const SAMPLE_REVIEWS = [
  {
    id: 1,
    name: "Hạ An",
    avatar: "HA",
    rating: 5,
    date: "10/05/2026",
    comment: "Sản phẩm xinh xắn và tỉ mỉ từng chi tiết, đúng như những gì mình kỳ vọng. Đóng gói rất cẩn thận, cảm ơn SoulMade nhiều nha!",
    verified: true,
  },
  {
    id: 2,
    name: "Thảo Chi",
    avatar: "TC",
    rating: 5,
    date: "02/04/2026",
    comment: "Món đồ thủ công có chất lượng cực tốt, cảm giác cầm rất chắc tay và ấm áp. Shop gói hàng rất có tâm, chắc chắn sẽ ủng hộ thêm.",
    verified: true,
  },
  {
    id: 3,
    name: "Hoàng Nguyên",
    avatar: "HN",
    rating: 4,
    date: "18/03/2026",
    comment: "Decor góc học tập cực hợp ý mình. Sản phẩm handmade nên có nét độc đáo riêng, chỉ là màu sắc hơi khác ảnh một chút xíu thôi.",
    verified: false,
  },
  {
    id: 4,
    name: "Minh Khuê",
    avatar: "MK",
    rating: 5,
    date: "05/03/2026",
    comment: "Cực kỳ ưng ý! Từng đường kim mũi chỉ đều thấy được sự chăm chút. Một món quà tuyệt vời cho chính mình và cả bạn bè.",
    verified: true,
  },
];

const StarRating = ({ rating, size = 16 }) => (
  <span style={{ display: "inline-flex", gap: "2px" }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <i
        key={star}
        className="fas fa-star"
        style={{
          fontSize: size,
          color: star <= rating ? "#f59e0b" : "#e2e8f0",
        }}
      />
    ))}
  </span>
);

const ReviewTab = ({ reviews = SAMPLE_REVIEWS }) => {
  const [writeMode, setWriteMode] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [allReviews, setAllReviews] = useState(reviews);
  const [submitted, setSubmitted] = useState(false);

  const avgRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
  }));

  const handleSubmit = () => {
    if (!newReview.comment.trim()) return;
    const review = {
      id: Date.now(),
      name: "Bạn",
      avatar: "BN",
      rating: newReview.rating,
      date: new Date().toLocaleDateString("vi-VN"),
      comment: newReview.comment,
      verified: false,
    };
    setAllReviews([review, ...allReviews]);
    setNewReview({ rating: 5, comment: "" });
    setWriteMode(false);
    setSubmitted(true);
  };

  return (
    <div className="review-section">
      {/* Tổng quan */}
      <div className="review-summary">
        <div className="review-avg">
          <span className="avg-number">{avgRating}</span>
          <StarRating rating={Math.round(parseFloat(avgRating))} size={22} />
          <span className="avg-total">{allReviews.length} đánh giá</span>
        </div>
        <div className="review-bars">
          {ratingCounts.map(({ star, count }) => (
            <div key={star} className="bar-row">
              <span className="bar-label">{star} <i className="fas fa-star" style={{ color: "#f59e0b", fontSize: 12 }} /></span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: allReviews.length ? `${(count / allReviews.length) * 100}%` : "0%" }}
                />
              </div>
              <span className="bar-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nút viết đánh giá */}
      <div className="review-actions">
        {submitted && <span className="review-thanks">Cảm ơn bạn đã đánh giá! </span>}
        {!writeMode && (
          <button className="write-review-btn" onClick={() => setWriteMode(true)}>
            <i className="fas fa-pen" style={{ marginRight: 8 }} />
            Viết đánh giá
          </button>
        )}
      </div>

      {/* Form viết đánh giá */}
      {writeMode && (
        <div className="review-form">
          <h4 className="form-title">Đánh giá của bạn</h4>
          <div className="star-select">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className="fas fa-star"
                style={{
                  fontSize: 28,
                  color: star <= newReview.rating ? "#f59e0b" : "#e2e8f0",
                  cursor: "pointer",
                  transition: "color 0.15s",
                }}
                onClick={() => setNewReview({ ...newReview, rating: star })}
              />
            ))}
          </div>
          <textarea
            className="review-textarea"
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            rows={4}
          />
          <div className="form-buttons">
            <button className="cancel-btn" onClick={() => setWriteMode(false)}>Hủy</button>
            <button className="submit-btn" onClick={handleSubmit} disabled={!newReview.comment.trim()}>
              Gửi đánh giá
            </button>
          </div>
        </div>
      )}

      {/* Danh sách đánh giá */}
      <div className="review-list">
        {allReviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="reviewer-avatar">{review.avatar}</div>
            <div className="reviewer-content">
              <div className="reviewer-header">
                <span className="reviewer-name">{review.name}</span>
                {review.verified && (
                  <span className="verified-badge">
                    <i className="fas fa-check-circle" style={{ marginRight: 4 }} />
                    Đã mua hàng
                  </span>
                )}
              </div>
              <div className="reviewer-meta">
                <StarRating rating={review.rating} size={13} />
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || null);
  const [isLoading, setIsLoading] = useState(!location.state?.product);
  const [error, setError] = useState(null);

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState("desc");

  useEffect(() => {
    if (product) {
      setMainImage(product.image || product.images?.[0] || "https://via.placeholder.com/500x350");
      return;
    }
    const fetchProduct = async () => {
      try {
        const response = await fetch("/Products.json");
        if (!response.ok) throw new Error("Không thể tải thông tin sản phẩm");
        const data = await response.json();
        const found = data.find((item) => String(item.id) === String(id));
        if (!found) throw new Error("Sản phẩm không tồn tại");

        const finalProduct = {
          ...found,
          image: imageMap[found.imageKey] || found.image,
        };

        setProduct(finalProduct);
        setMainImage(finalProduct.image || finalProduct.images?.[0] || "https://via.placeholder.com/500x350");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, product]);

  if (isLoading) return <div className="detail-container">Đang tải chi tiết...</div>;
  if (error) return <div className="detail-container">Lỗi: {error}</div>;
  if (!product) return null;

  const hasVariants = product.variants && product.variants.length > 0;
  const displayPrice = hasVariants ? product.variants[selectedVariant].price : product.currentPrice;
  const displayOriginal = hasVariants ? product.variants[selectedVariant].originalPrice : product.originalPrice;
  const displayDiscount = hasVariants ? product.variants[selectedVariant].discount : product.discount;

  const handleAddToCart = () => {
    const savedCart = localStorage.getItem("cart");
    const cart = savedCart ? JSON.parse(savedCart) : [];
    const cartItemId = hasVariants ? `${product.id}-${selectedVariant}` : product.id;
    const cartItemName = hasVariants ? `${product.name} - ${product.variants[selectedVariant].name}` : product.name;

    const existingItemIndex = cart.findIndex((item) => item.id === cartItemId);
    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        id: cartItemId,
        name: cartItemName,
        currentPrice: displayPrice,
        image: mainImage,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/cart");
  };

  const galleryImages = product.images || [mainImage];

  return (
    <div className="detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <div className="detail-top-section">
        <div className="detail-gallery">
          <div className="detail-image-main">
            <img src={mainImage} alt={product.name} />
          </div>
        </div>

        <div className="detail-info">
          <h2>{product.name}</h2>

          <div className="detail-meta">
            {product.rating && (
              <span>
                <i className="fas fa-star" style={{ color: "#f59e0b" }}></i> {product.rating}
              </span>
            )}
            <span className="meta-divider">|</span>
            {product.sold && <span>Đã bán {product.sold}</span>}
          </div>

          <p className="detail-price">
            <span className="current-price">{displayPrice}</span>
            {displayOriginal && <span className="original-price">{displayOriginal}</span>}
            {displayDiscount && <span className="discount">{displayDiscount}</span>}
          </p>

          <div className="detail-sizes">
            <h4 className="section-label">Khối lượng / Kích thước:</h4>
            <div className="size-options">
              {hasVariants ? (
                product.variants.map((variant, index) => (
                  <button key={index} className={`ram-ssd-tag ${selectedVariant === index ? "active" : ""}`} onClick={() => setSelectedVariant(index)}>
                    {variant.name}
                  </button>
                ))
              ) : (
                <>
                  {product.sizeS && <button className="ram-ssd-tag">{product.sizeS}</button>}
                  {product.sizeM && <button className="ram-ssd-tag">{product.sizeM}</button>}
                  {product.sizeL && <button className="ram-ssd-tag">{product.sizeL}</button>}
                </>
              )}
            </div>
          </div>

          <div className="detail-policies">
            <div className="policy-item">
              <i className="fas fa-truck"></i> Giao hàng tận nơi
            </div>
            <div className="policy-item">
              <i className="fas fa-box-open"></i> Kiểm tra hàng trước khi thanh toán
            </div>
            <div className="policy-item">
              <i className="fas fa-undo"></i> Đổi trả 7 ngày nếu lỗi 
            </div>
          </div>

          <button className="buy-now-button" onClick={handleAddToCart}>
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>

      <div className="detail-bottom-section">
        <div className="tab-headers">
          <button className={`tab-btn ${activeTab === "desc" ? "active" : ""}`} onClick={() => setActiveTab("desc")}>
            Mô tả sản phẩm
          </button>
          <button className={`tab-btn ${activeTab === "specs" ? "active" : ""}`} onClick={() => setActiveTab("specs")}>
            Thông số kỹ thuật
          </button>
          <button className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>
            Đánh giá ({SAMPLE_REVIEWS.length})
          </button>
        </div>

       <div className="tab-content">
  {activeTab === "desc" && (
    <div className="content-desc">
      <p style={{ fontSize: "16px", fontWeight: "500" }}>
        {product.description || "Sản phẩm được làm thủ công tỉ mỉ, chăm chút trong từng chi tiết bởi SoulMade."}
      </p>

      <div className="generic-description" style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px dashed #d4cbb8" }}>
        <h4 style={{ color: "#064e3b", marginBottom: "12px" }}>1. Đặc điểm nổi bật</h4>
        <ul style={{ paddingLeft: "20px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <li>Được chế tác hoàn toàn bằng tay từ những nguyên liệu chọn lọc, mang đậm dấu ấn riêng biệt.</li>
          <li>Sự kết hợp hoàn hảo giữa kỹ thuật truyền thống và thiết kế hiện đại, tạo nên vẻ đẹp bền vững theo thời gian.</li>
          <li>Mỗi sản phẩm là một tác phẩm duy nhất, đảm bảo tính thẩm mỹ cao và an toàn cho người sử dụng.</li>
        </ul>

        <h4 style={{ color: "#064e3b", marginBottom: "12px" }}>2. Hướng dẫn bảo quản & Sử dụng</h4>
        <ul style={{ paddingLeft: "20px", marginBottom: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <li>Bảo quản ở nơi khô ráo, tránh những nơi có độ ẩm cao hoặc tiếp xúc trực tiếp với ánh nắng mặt trời gay gắt.</li>
          <li>Sử dụng khăn mềm, ẩm để vệ sinh bề mặt sản phẩm nhẹ nhàng nhằm giữ gìn độ bền đẹp lâu dài.</li>
          <li>Nên sử dụng đúng mục đích và bảo quản cẩn thận để các chi tiết thủ công giữ được vẻ nguyên vẹn ban đầu.</li>
        </ul>

        <h4 style={{ color: "#064e3b", marginBottom: "12px" }}>3. Tâm tình từ SoulMade</h4>
        <p style={{ textAlign: "justify", lineHeight: "1.6", color: "#475569" }}>
          SoulMade không chỉ tạo ra sản phẩm, mà chúng tui đặt cả tâm huyết vào từng món đồ để gửi gắm sự an yên đến ngôi nhà của bạn. 
          Cam kết sản phẩm thủ công chất lượng, đúng như mô tả và hình ảnh. Nếu có bất kỳ sự không hài lòng nào về sản phẩm, 
          SoulMade sẵn sàng lắng nghe và hỗ trợ đổi trả tận tâm. Hy vọng những món đồ nhỏ xinh này sẽ mang đến niềm vui cho cuộc sống của bạn.
        </p>
      </div>
    </div>
  )}
          {activeTab === "specs" && (
            <div className="content-specs">
              {product.specs ? (
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], idx) => (
                      <tr key={idx}>
                        <td className="spec-key">{key}</td>
                        <td className="spec-value">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Chưa có thông số kỹ thuật.</p>
              )}
            </div>
          )}
          {activeTab === "reviews" && <ReviewTab />}
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;