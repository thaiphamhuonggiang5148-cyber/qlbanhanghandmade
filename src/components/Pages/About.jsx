import React from 'react';
import './About.css';

const About = () => {
  const stats = [
    { number: '10+', label: 'Năm Kinh Nghiệm' },
    { number: '5.000+', label: 'Công Trình Hoàn Thành' },
    { number: '200+', label: 'Nhà Cung Cấp Đối Tác' },
    { number: '98%', label: 'Khách Hàng Hài Lòng' },
  ];

  const team = [
    {
      name: 'Nguyễn Văn Minh',
      role: 'Giám Đốc Điều Hành',
      desc: '15 năm kinh nghiệm trong ngành vật liệu xây dựng và quản lý chuỗi cung ứng.',
    },
    {
      name: 'Trần Thị Hương',
      role: 'Giám Đốc Kinh Doanh',
      desc: 'Chuyên gia tư vấn vật tư xây dựng, từng hợp tác với hơn 300 nhà thầu lớn toàn quốc.',
    },
    {
      name: 'Lê Quốc Bảo',
      role: 'Trưởng Phòng Kỹ Thuật',
      desc: 'Kỹ sư xây dựng với chuyên môn kiểm định chất lượng vật liệu và tư vấn thi công.',
    },
  ];

  const milestones = [
    {
      year: '2014',
      title: 'Thành Lập Moon VLXD',
      desc: 'Khởi đầu với một kho nhỏ tại TP.HCM, Moon VLXD ra đời với sứ mệnh cung cấp vật liệu xây dựng chất lượng, minh bạch giá cả.',
    },
    {
      year: '2016',
      title: 'Mở Rộng Danh Mục Sản Phẩm',
      desc: 'Bổ sung các dòng sản phẩm hoàn thiện cao cấp: gạch ốp lát, sơn nước, thiết bị vệ sinh thương hiệu lớn.',
    },
    {
      year: '2018',
      title: 'Ra Mắt Hệ Thống Báo Giá Online',
      desc: 'Tiên phong trong ngành với nền tảng báo giá tự động, cập nhật theo thời gian thực, giúp khách hàng tra cứu nhanh chóng.',
    },
    {
      year: '2020',
      title: 'Đạt 1.000 Công Trình Phục Vụ',
      desc: 'Cột mốc quan trọng: Moon VLXD đã đồng hành cùng hơn 1.000 công trình dân dụng và thương mại trên toàn quốc.',
    },
    {
      year: '2022',
      title: 'Khai Trương Kho Hàng Miền Bắc',
      desc: 'Mở rộng hệ thống phân phối với kho trung chuyển tại Hà Nội, rút ngắn thời gian giao hàng cho khu vực phía Bắc.',
    },
    {
      year: '2024',
      title: 'Nền Tảng Thương Mại Điện Tử Toàn Diện',
      desc: 'Ra mắt website thương mại điện tử tích hợp đặt hàng, theo dõi vận chuyển và tư vấn kỹ thuật trực tuyến 24/7.',
    },
  ];

  const partners = [
    'SCG', 'Hà Tiên 1', 'Viglacera', 'Toto', 'Dulux', 'Pomina',
    'Hoa Sen', 'INSEE', 'Prime Group', 'Caesar',
  ];

  const products = [
    {
      icon: '🏗️',
      name: 'Vật Liệu Thô',
      items: ['Cát xây dựng các loại', 'Đá dăm, đá 1×2, đá 4×6', 'Xi măng các nhãn hiệu', 'Gạch xây thẻ, gạch block'],
    },
    {
      icon: '🔩',
      name: 'Sắt Thép & Kết Cấu',
      items: ['Thép cây, thép cuộn Hòa Phát', 'Thép hình I, U, V', 'Lưới thép hàn, thép tấm', 'Ống thép, ty ren, bu lông'],
    },
    {
      icon: '🪟',
      name: 'Vật Liệu Hoàn Thiện',
      items: ['Gạch ốp lát cao cấp', 'Sơn nội – ngoại thất', 'Trần thạch cao, xốp cách nhiệt', 'Kính cường lực, nhôm định hình'],
    },
    {
      icon: '🚿',
      name: 'Thiết Bị Vệ Sinh',
      items: ['Bồn cầu, chậu rửa TOTO, Caesar', 'Sen vòi, bồn tắm cao cấp', 'Gương phòng tắm, tủ lavabo', 'Phụ kiện nhà tắm đồng bộ'],
    },
  ];

  return (
    <div className="about-container">
      {/* Hero */}
      <div className="about-hero">
        <h1 className="about-title">Giới Thiệu Về Moon VLXD</h1>
        <p className="about-subtitle">Hành trình xây dựng niềm tin và đồng hành cùng mọi công trình vững bền.</p>
      </div>

      <div className="about-content">

        {/* Story */}
        <section className="about-section">
          <h2>Câu Chuyện Của Chúng Tôi</h2>
          <p>Moon VLXD tự hào là một trong những đơn vị hàng đầu cung cấp vật liệu xây dựng thô và hoàn thiện chất lượng cao tại Việt Nam. Được thành lập với mục tiêu đơn giản hóa quy trình cung ứng vật tư, chúng tôi mang đến giải pháp toàn diện từ cát, đá, xi măng, sắt thép cho đến gạch ốp lát, sơn và thiết bị vệ sinh cao cấp.</p>
          <p style={{ marginTop: '16px' }}>Hơn một thập kỷ hoạt động, Moon VLXD đã xây dựng được mạng lưới cung ứng vững chắc, kết nối trực tiếp với hơn 200 nhà sản xuất và nhà phân phối uy tín trong và ngoài nước. Điều này giúp chúng tôi kiểm soát chất lượng từ đầu vào, đảm bảo mỗi sản phẩm đến tay khách hàng đều đạt tiêu chuẩn kỹ thuật cao nhất với mức giá cạnh tranh nhất thị trường.</p>
        </section>

        {/* Stats */}
        <section className="about-stats">
          {stats.map((s, i) => (
            <div className="stat-item" key={i}>
              <span className="stat-number">{s.number}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* Vision & Mission */}
        <div className="about-grid">
          <div className="about-card">
            <h3>Tầm Nhìn</h3>
            <p>Trở thành biểu tượng niềm tin hàng đầu trong ngành cung ứng vật liệu xây dựng tại Đông Nam Á, nơi mọi nhà thầu và gia chủ đều nghĩ đến đầu tiên khi khởi công công trình. Chúng tôi hướng tới một hệ sinh thái cung ứng vật tư thông minh, số hóa toàn diện và phát triển bền vững.</p>
          </div>
          <div className="about-card">
            <h3>Sứ Mệnh</h3>
            <p>Cung cấp vật tư chính hãng, đúng tiến độ với giá cả cạnh tranh nhất. Chúng tôi không chỉ bán vật liệu — chúng tôi cùng bạn đặt nền móng cho những mái ấm vững bền, góp phần xây dựng hạ tầng quốc gia và nâng cao chất lượng cuộc sống cộng đồng.</p>
          </div>
        </div>

        {/* Core Values */}
        <section className="about-values">
          <h2>Giá Trị Cốt Lõi</h2>
          <div className="values-list">
            <div className="value-item">
              <h4>Chất Lượng Hàng Đầu</h4>
              <p>Mọi sản phẩm xuất xưởng đều đạt chuẩn kiểm định kỹ thuật cao nhất. Chúng tôi hợp tác trực tiếp với nhà sản xuất, loại bỏ hàng trung gian để kiểm soát chất lượng toàn diện.</p>
            </div>
            <div className="value-item">
              <h4>Minh Bạch Giá Cả</h4>
              <p>Hệ thống báo giá tự động, cập nhật liên tục theo biến động thị trường. Không phụ thu ẩn, không chi phí bất ngờ — mọi thứ rõ ràng từ lúc đặt hàng đến khi nhận hàng.</p>
            </div>
            <div className="value-item">
              <h4>Tận Tâm Phục Vụ</h4>
              <p>Đội ngũ tư vấn 24/7, hỗ trợ tính toán khối lượng vật tư tối ưu nhất cho công trình, giúp khách hàng tiết kiệm chi phí mà vẫn đảm bảo tiến độ và chất lượng.</p>
            </div>
          </div>
        </section>

        {/* Products */}
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

        {/* Timeline */}
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

        {/* Team */}
        <section className="about-team">
          <h2>Đội Ngũ Lãnh Đạo</h2>
          <p className="section-desc">Đằng sau mỗi chuyến hàng đúng hẹn là một đội ngũ tận tâm với nhiều năm kinh nghiệm trong ngành.</p>
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

        {/* Partners */}
        <section className="about-partners">
          <h2>Đối Tác Thương Hiệu</h2>
          <p className="section-desc">Chúng tôi phân phối chính hãng các thương hiệu vật liệu xây dựng uy tín hàng đầu trong và ngoài nước.</p>
          <div className="partners-grid">
            {partners.map((p, i) => (
              <div className="partner-tag" key={i}>{p}</div>
            ))}
          </div>
        </section>

        {/* Commitment */}
        <section className="about-section commitment">
          <h2>Cam Kết Từ Moon VLXD</h2>
          <ul>
            <li>Hoàn tiền 100% nếu phát hiện hàng giả, hàng nhái, kém chất lượng.</li>
            <li>Vận chuyển nhanh chóng, an toàn đến tận chân công trình trong vòng 24–48 giờ.</li>
            <li>Chính sách chiết khấu cực kỳ hấp dẫn cho các nhà thầu và đối tác dài hạn.</li>
            <li>Hỗ trợ kỹ thuật miễn phí: tư vấn lựa chọn vật tư phù hợp với từng hạng mục công trình.</li>
            <li>Bảo hành sản phẩm theo đúng chính sách của nhà sản xuất, không gây khó dễ khi khiếu nại.</li>
          </ul>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <h2>Sẵn Sàng Bắt Đầu Công Trình?</h2>
          <p>Liên hệ ngay với đội ngũ tư vấn của Moon VLXD để nhận báo giá tốt nhất và hỗ trợ lên kế hoạch vật tư tối ưu cho công trình của bạn.</p>
          <div className="cta-buttons">
            <a href="/contact" className="btn-primary">Liên Hệ Ngay</a>
            <a href="/products" className="btn-secondary">Xem Sản Phẩm</a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;