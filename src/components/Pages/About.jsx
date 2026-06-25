import React from 'react';
import './About.css';

const About = () => {
  const stats = [
    { number: '5+', label: 'Năm Đam Mê' },
    { number: '1.200+', label: 'Sản Phẩm Đã Hoàn Thiện' },
    { number: '50+', label: 'Nguyên Liệu Tuyển Chọn' },
    { number: '99%', label: 'Khách Hàng Hài Lòng' },
  ];

  const team = [
    {
      name: 'Lê Minh Anh',
      role: 'Founder & Head Artisan',
      desc: 'Một người yêu cái đẹp thô mộc, dành 8 năm nghiên cứu các kỹ thuật dệt nhuộm tự nhiên và thổi hồn vào sản phẩm thủ công.',
    },
    {
      name: 'Hoàng Nhật Nam',
      role: 'Lead Designer',
      desc: 'Chuyên gia thiết kế tối giản. Nam tin rằng mỗi món đồ handmade hoàn hảo là sự kết hợp giữa công năng và cảm xúc nghệ thuật.',
    },
    {
      name: 'Phạm Thu Thảo',
      role: 'Craftsmanship Lead',
      desc: 'Đôi bàn tay khéo léo với hơn 10 năm kinh nghiệm trong nghề thêu thùa và đan móc, người trực tiếp đào tạo các thế hệ nghệ nhân trẻ.',
    },
  ];

  const milestones = [
    {
      year: '2021',
      title: 'Thành Lập SoulMade',
      desc: 'Khởi đầu từ một xưởng nhỏ tại TP.HCM, SoulMade ra đời với sứ mệnh mang những món đồ thủ công tinh tế đến mọi gia đình.',
    },
    {
      year: '2022',
      title: 'Ra Mắt BST Đầu Tiên',
      desc: 'Giới thiệu các dòng sản phẩm dệt may và phụ kiện làm từ nguyên liệu tự nhiên, thân thiện với môi trường.',
    },
    {
      year: '2023',
      title: 'Kết Nối Nghệ Nhân',
      desc: 'Mở rộng mạng lưới hợp tác với các làng nghề truyền thống, bảo tồn và phát triển giá trị văn hóa vào sản phẩm hiện đại.',
    },
    {
      year: '2024',
      title: 'Phát Triển Đơn Hàng Tùy Chỉnh',
      desc: 'Dịch vụ thiết kế handmade cá nhân hóa được đón nhận nồng nhiệt, khẳng định dấu ấn riêng của từng khách hàng.',
    },
    {
      year: '2025',
      title: 'Workshop Handmade',
      desc: 'Khai trương không gian trải nghiệm thực tế, nơi khách hàng có thể tự tay làm nên món đồ tâm đắc.',
    },
    {
      year: '2026',
      title: 'Nền Tảng Handmade Toàn Diện',
      desc: 'Ra mắt website tích hợp đặt hàng cá nhân hóa, theo dõi quá trình làm sản phẩm và tư vấn sáng tạo 24/7.',
    },
  ];

  const partners = [
    'Lụa Tơ Tằm Hà Đông', 'Gốm Bát Tràng', 'Mây Tre Đan...', 'Nhuộm Tự Nhiên', 'Sợi Tự Nhiên',
  ];

  const products = [
    {
      icon: '🧶',
      name: 'Phụ Kiện Dệt May',
      items: ['Túi xách handmade', 'Khăn quàng thủ công', 'Trang trí decor dệt', 'Vỏ gối thêu tay'],
    },
    {
      icon: '🏺',
      name: 'Gốm & Decor',
      items: ['Bình hoa thủ công', 'Chậu gốm nghệ thuật', 'Đĩa trưng bày', 'Phụ kiện gốm mini'],
    },
    {
      icon: '🌿',
      name: 'Sản Phẩm Từ Thiên Nhiên',
      items: ['Nến thơm tinh dầu', 'Xà phòng thảo mộc', 'Đồ dùng mây tre', 'Giỏ đựng đồ thủ công'],
    },
    {
      icon: '🎨',
      name: 'Quà Tặng Cá Nhân Hóa',
      items: ['Tranh thêu tên riêng', 'Thiệp vẽ tay', 'Đồ chơi len (Amigurumi)', 'Phụ kiện khắc tên'],
    },
  ];

  return (
    <div className="about-container">
      <div className="about-hero">
        <h1 className="about-title">Giới Thiệu Về SoulMade</h1>
        <p className="about-subtitle">Nơi mỗi sản phẩm đều chứa đựng tâm hồn và sự tỉ mỉ của đôi bàn tay người nghệ nhân.</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Câu Chuyện Của Chúng Tôi</h2>
          <p>SoulMade tự hào là đơn vị tiên phong mang đến những sản phẩm thủ công (handmade) tinh tế, chất lượng cao tại Việt Nam. Chúng tôi tin rằng mỗi món đồ không chỉ là vật dụng, mà còn là một câu chuyện, một tác phẩm nghệ thuật mang đậm dấu ấn cá nhân.</p>
          <p style={{ marginTop: '16px' }}>Sau 5 năm hình thành, SoulMade đã xây dựng mạng lưới kết nối trực tiếp với hơn 50 nghệ nhân và nguồn nguyên liệu tự nhiên uy tín. Chúng tôi cam kết mang đến những sản phẩm an toàn, bền vững và đầy tính thẩm mỹ.</p>
        </section>

        <section className="about-stats">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <span className="stat-number">{s.number}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        <div className="about-grid">
          <div className="about-card">
            <h3>Tầm Nhìn</h3>
            <p>Trở thành thương hiệu handmade hàng đầu, nơi tôn vinh giá trị thủ công và sự sáng tạo không giới hạn. Chúng tôi hướng tới việc đưa sản phẩm thủ công Việt vươn tầm quốc tế.</p>
          </div>
          <div className="about-card">
            <h3>Sứ Mệnh</h3>
            <p>Lan tỏa thông điệp "Sống chậm, trân trọng thủ công". Chúng tôi nỗ lực tạo ra những sản phẩm giúp khách hàng cảm nhận được sự ấm áp, tinh tế trong từng không gian sống.</p>
          </div>
        </div>

        <section className="about-values">
          <h2>Giá Trị Cốt Lõi</h2>
          <div className="values-list">
            <div className="value-item">
              <h4>Sự Tỉ Mỉ</h4>
              <p>Mỗi đường kim mũi chỉ, mỗi nét vẽ đều được thực hiện thủ công với sự tập trung cao nhất, đảm bảo tính thẩm mỹ tuyệt đối.</p>
            </div>
            <div className="value-item">
              <h4>Chất Liệu Xanh</h4>
              <p>Chúng tôi ưu tiên nguyên liệu tự nhiên, thân thiện với môi trường, an toàn cho người sử dụng và bền bỉ theo thời gian.</p>
            </div>
            <div className="value-item">
              <h4>Dấu Ấn Riêng</h4>
              <p>Tại SoulMade, bạn không chỉ mua sản phẩm — bạn sở hữu một món quà duy nhất, được tùy chỉnh theo sở thích riêng của mình.</p>
            </div>
          </div>
        </section>

        <section className="about-products">
          <h2>Danh Mục Sản Phẩm Chủ Lực</h2>
          <div className="products-grid">
            {products.map((p, i) => (
              <div className="product-card" key={i}>
                <div className="product-icon">{p.icon}</div>
                <h4>{p.name}</h4>
                <ul>
                  {p.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="about-timeline">
          <h2>Hành Trình Phát Triển</h2>
          <div className="timeline-list">
            {milestones.map((m, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-year">{m.year}</div>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <h4>{m.title}</h4>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-team">
          <h2>Đội Ngũ Nghệ Nhân</h2>
          <p className="section-desc">Những bàn tay tài hoa đứng sau các thiết kế tâm huyết tại SoulMade.</p>
          <div className="team-grid">
            {team.map((member, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar">{member.name.split(' ').pop()[0]}</div>
                <h4>{member.name}</h4>
                <span className="team-role">{member.role}</span>
                <p>{member.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-partners">
          <h2>Nguyên Liệu & Đối Tác</h2>
          <p className="section-desc">Chúng tôi hợp tác cùng các nghệ nhân làng nghề uy tín để duy trì nguồn nguyên liệu sạch và tinh khiết.</p>
          <div className="partners-grid">
            {partners.map((p, i) => (
              <div className="partner-tag" key={i}>{p}</div>
            ))}
          </div>
        </section>

        <section className="about-section commitment">
          <h2>Cam Kết Từ SoulMade</h2>
          <ul>
            <li>Chất lượng thủ công: Hoàn tiền nếu sản phẩm không đúng như thiết kế thủ công cam kết.</li>
            <li>Đóng gói bền vững: Hạn chế nhựa, sử dụng bao bì giấy thân thiện môi trường.</li>
            <li>Tư vấn tận tình: Hỗ trợ thiết kế theo ý tưởng riêng của khách hàng.</li>
            <li>Bảo hành nghệ nhân: Bảo dưỡng và chăm sóc sản phẩm định kỳ cho khách hàng thân thiết.</li>
          </ul>
        </section>

        <section className="about-cta">
          <h2>Bạn Đã Sẵn Sàng Sở Hữu Một Món Đồ Thủ Công Riêng?</h2>
          <p>Hãy liên hệ với SoulMade để cùng chúng tôi hiện thực hóa món đồ handmade mơ ước của bạn!</p>
          <div className="cta-buttons">
            <a href="/contact" className="btn-primary">Liên Hệ Ngay</a>
            <a href="/products" className="btn-secondary">Khám Phá Bộ Sưu Tập</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;