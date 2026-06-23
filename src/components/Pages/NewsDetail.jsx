import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './NewsDetail.css';

// ── CONSTANTS ──────────────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  "Thị trường":  "#e74c3c",
  "Sự kiện":     "#2980b9",
  "Kinh nghiệm": "#27ae60",
  "Báo giá":     "#e67e22",
  "Xu hướng":    "#8e44ad",
  "Khuyến mãi":  "#c0392b",
};

// ── DATA (synced with News.jsx) ─────────────────────────────────────────────────
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
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Thị trường sắt thép xây dựng trong nước đang trải qua giai đoạn biến động nhẹ. Theo các chuyên gia kinh tế, quý III/2026 sẽ chứng kiến sự giằng co giữa đà tăng giá nguyên liệu đầu vào và nỗ lực bình ổn từ các nhà sản xuất nội địa.</p>
      <h2>Nguyên nhân chính tác động đến giá thép</h2>
      <p>Giá quặng sắt và than cốc trên thị trường quốc tế tiếp tục duy trì ở mức cao do nhu cầu phục hồi từ các nền kinh tế lớn. Điều này trực tiếp làm tăng chi phí sản xuất phôi thép tại các nhà máy trong nước như Hòa Phát, Pomina và VAS. Ngoài ra, tỉ giá USD/VND có xu hướng biến động cũng ảnh hưởng đáng kể đến chi phí nhập khẩu phế liệu và phôi thép — nguyên liệu đầu vào chiếm tỷ trọng lớn trong cơ cấu sản xuất thép cán xây dựng.</p>
      <blockquote>"Mặc dù áp lực chi phí đầu vào lớn, các nhà sản xuất trong nước vẫn đang cố gắng tối ưu hóa quy trình để giữ mức giá cạnh tranh nhất cho người tiêu dùng." — Đại diện Hiệp hội Thép Việt Nam.</blockquote>
      <h2>Dự báo diễn biến quý III/2026</h2>
      <p>Theo dự báo từ các đơn vị phân tích thị trường, giá thép xây dựng sẽ tăng nhẹ từ 3–5% trong quý III, chủ yếu do nhu cầu xây dựng các dự án hạ tầng lớn bước vào giai đoạn tăng tốc. Tuy nhiên, làn sóng thép nhập khẩu giá rẻ từ Trung Quốc sẽ là yếu tố kìm hãm đà tăng, tạo ra biên độ dao động hẹp trong suốt quý.</p>
      <h2>Lời khuyên cho nhà thầu và chủ đầu tư</h2>
      <ul>
        <li>Chủ động cập nhật báo giá hàng tuần từ các đại lý cấp 1 uy tín.</li>
        <li>Ký kết hợp đồng nguyên tắc sớm để chốt giá cho các dự án dài hạn, tránh biến động bất ngờ.</li>
        <li>Ưu tiên chọn thép có CO/CQ đầy đủ và tem chống giả, đặc biệt với công trình yêu cầu kỹ thuật cao.</li>
        <li>Tối ưu kế hoạch thi công để tập trung mua hàng khi giá ở vùng đáy của chu kỳ.</li>
      </ul>
      <p>Moon VLXD cam kết luôn theo sát diễn biến thị trường, mang đến mức giá minh bạch và chính sách chiết khấu tốt nhất cho các đối tác. Liên hệ hotline để được tư vấn báo giá ngay hôm nay.</p>
    `
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
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Ngày 24/05/2026, lễ ký kết hợp tác chiến lược giữa Moon VLXD và Công ty Xi măng Hà Tiên 1 đã diễn ra thành công tốt đẹp tại trụ sở chính của Hà Tiên 1. Sự kiện đánh dấu cột mốc quan trọng trong việc nâng cao chất lượng chuỗi cung ứng vật liệu xây dựng tại khu vực miền Nam.</p>
      <h2>Ý nghĩa của sự kiện ký kết</h2>
      <p>Xi măng Hà Tiên là một trong những thương hiệu xi măng hàng đầu Việt Nam với hơn 60 năm kinh nghiệm sản xuất, được tin dùng tại hàng triệu công trình trên cả nước. Việc trở thành nhà phân phối cấp 1 khẳng định uy tín và năng lực của Moon VLXD trên thị trường vật liệu xây dựng miền Nam.</p>
      <blockquote>"Đây là bước tiến chiến lược giúp chúng tôi rút ngắn chuỗi phân phối, đưa sản phẩm chất lượng đến tay người tiêu dùng với mức giá thực sự cạnh tranh." — Giám đốc Moon VLXD.</blockquote>
      <h2>Lợi ích trực tiếp cho khách hàng</h2>
      <p>Với tư cách nhà phân phối cấp 1, Moon VLXD nhập hàng trực tiếp từ nhà máy, loại bỏ hoàn toàn các tầng trung gian. Khách hàng được hưởng những lợi ích thiết thực:</p>
      <ul>
        <li><strong>Giá tận gốc nhà máy</strong> — tiết kiệm 5–10% so với kênh phân phối thông thường.</li>
        <li><strong>Hàng chính hãng 100%</strong> — tem chống giả, CO/CQ đầy đủ theo từng lô hàng.</li>
        <li><strong>Nguồn cung ổn định</strong> — kho bãi 5.000m² đảm bảo hàng sẵn sàng giao ngay.</li>
        <li><strong>Chính sách hậu mãi chính hãng</strong> — hỗ trợ kỹ thuật, đổi trả theo quy định nhà sản xuất.</li>
      </ul>
      <h2>Kế hoạch triển khai</h2>
      <p>Trong quý III/2026, Moon VLXD sẽ mở rộng chương trình ưu đãi đặc biệt dành riêng cho các nhà thầu và chủ đầu tư mua xi măng Hà Tiên số lượng lớn. Chi tiết chính sách chiết khấu sẽ được thông báo trong thời gian sớm nhất. Liên hệ hotline để đặt lịch gặp tư vấn và nhận báo giá ưu tiên.</p>
    `
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
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Gạch ốp lát là một trong những vật liệu hoàn thiện quan trọng nhất, ảnh hưởng trực tiếp đến thẩm mỹ và không khí sống của ngôi nhà. Ngoài các yếu tố kỹ thuật, người Việt còn đặc biệt chú trọng đến yếu tố phong thủy khi lựa chọn màu sắc và chất liệu.</p>
      <h2>Nguyên tắc chọn gạch theo bản mệnh</h2>
      <p>Theo quan niệm phong thủy truyền thống, màu sắc và chất liệu gạch cần tương hợp với ngũ hành của gia chủ. Điều này cần được kết hợp hài hòa với kiến trúc tổng thể và sở thích thẩm mỹ cá nhân.</p>
      <ul>
        <li><strong>Mệnh Thổ</strong> — Hợp với gạch màu vàng kem, be, nâu đất. Tone warm kích hoạt năng lượng tích cực.</li>
        <li><strong>Mệnh Kim</strong> — Phù hợp gạch trắng, xám nhạt, gạch vân đá marble trắng sạch.</li>
        <li><strong>Mệnh Thủy</strong> — Chọn gạch tông xanh biển, xanh lá nhạt, gạch giả gỗ tối màu.</li>
        <li><strong>Mệnh Mộc</strong> — Ưu tiên gạch giả gỗ, xanh lá, hoặc tone nâu tự nhiên ấm áp.</li>
        <li><strong>Mệnh Hỏa</strong> — Hợp với gạch đỏ gạch, cam đất, tím nhẹ hoặc tone ấm nóng.</li>
      </ul>
      <h2>Tiêu chí kỹ thuật không thể bỏ qua</h2>
      <p>Phong thủy là quan trọng, nhưng chất lượng kỹ thuật của gạch mới quyết định tuổi thọ công trình. Khi chọn gạch, hãy kiểm tra các thông số sau:</p>
      <ul>
        <li><strong>Độ hút nước</strong> — Gạch nhà vệ sinh, sân thượng cần ≤0.5% (granite, full body). Gạch phòng khô dùng loại 3–6% là hợp lý.</li>
        <li><strong>Độ cứng bề mặt</strong> — Nên chọn từ 6 Mohs trở lên cho sàn thông thường, 7–8 Mohs cho khu đi lại nhiều.</li>
        <li><strong>Hệ số ma sát (R-value)</strong> — Sân, cầu thang, nhà vệ sinh cần R10 trở lên để chống trơn trượt.</li>
        <li><strong>Sai số kích thước</strong> — Gạch chất lượng có sai số ≤0.5mm. Sai số lớn khiến đường ron không đều, mất thẩm mỹ.</li>
      </ul>
      <blockquote>"Nhiều gia chủ mắc sai lầm khi chọn gạch chỉ theo màu sắc mà bỏ qua thông số kỹ thuật. Kết quả là gạch bong, nứt, hoặc trơn trượt gây tai nạn sau vài năm sử dụng." — Kỹ sư tư vấn Moon VLXD.</blockquote>
      <h2>Mẹo tối ưu ngân sách gạch ốp lát</h2>
      <p>Thay vì chọn gạch nhập khẩu cho toàn bộ công trình, hãy ưu tiên gạch nhập ở những khu vực focal point như phòng khách, sảnh và dùng gạch nội địa chất lượng cao cho các phòng phụ. Cách này giúp tiết kiệm 20–30% ngân sách mà vẫn đảm bảo thẩm mỹ tổng thể ấn tượng.</p>
    `
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
    image: "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Bảng giá dưới đây được tổng hợp từ các bãi khai thác và cung cấp lớn tại khu vực Đồng Nai, Bình Dương và Long An — là các nguồn cung chính cho thị trường TP.HCM. Giá có thể thay đổi theo khối lượng và địa điểm giao hàng.</p>
      <h2>Bảng giá cát xây dựng tháng 5/2026</h2>
      <ul>
        <li><strong>Cát xây (cát vàng Đồng Nai)</strong> — 320.000 – 360.000 đ/m³ (chưa VAT, chưa vận chuyển)</li>
        <li><strong>Cát tô (cát mịn)</strong> — 280.000 – 320.000 đ/m³</li>
        <li><strong>Cát san lấp</strong> — 180.000 – 220.000 đ/m³</li>
        <li><strong>Cát bê tông (size 0.5–2mm)</strong> — 350.000 – 400.000 đ/m³</li>
      </ul>
      <h2>Bảng giá đá xây dựng tháng 5/2026</h2>
      <ul>
        <li><strong>Đá 0x4 (đá mi bụi)</strong> — 200.000 – 240.000 đ/m³</li>
        <li><strong>Đá 1x2 (đá dăm 10–20mm)</strong> — 260.000 – 300.000 đ/m³</li>
        <li><strong>Đá 2x4 (đá dăm 20–40mm)</strong> — 240.000 – 280.000 đ/m³</li>
        <li><strong>Đá 4x6 (đá hộc)</strong> — 220.000 – 260.000 đ/m³</li>
      </ul>
      <blockquote>Giá trên là giá tại bãi. Chi phí vận chuyển nội thành TP.HCM dao động 80.000 – 150.000 đ/m³ tùy khoảng cách. Đặt hàng ≥50m³ có thể thương lượng giảm thêm 5–8%.</blockquote>
      <h2>Yếu tố ảnh hưởng giá cát đá tháng tới</h2>
      <p>Chi phí nhiên liệu vận chuyển và tình hình cấp phép khai thác mỏ là hai yếu tố chính có thể đẩy giá cát đá tăng nhẹ trong tháng 6/2026. Nhà thầu nên cân nhắc đặt hàng sớm nếu có nhu cầu lớn trong quý tới để cố định giá hợp đồng.</p>
    `
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
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Ngành xây dựng Việt Nam đang chứng kiến sự chuyển dịch mạnh mẽ sang các vật liệu thân thiện với môi trường. Đây không chỉ là xu hướng toàn cầu mà còn là yêu cầu thực tiễn khi Việt Nam hướng tới cam kết Net Zero Carbon vào năm 2050.</p>
      <h2>1. Gạch không nung — Thay thế gạch đất nung truyền thống</h2>
      <p>Gạch bê tông khí chưng áp (AAC) và gạch bê tông nhẹ (CLC) đang thay thế dần gạch đất nung truyền thống. Nhẹ hơn 60–70%, cách nhiệt tốt hơn 6–8 lần, thi công nhanh hơn 30% và giảm tải trọng công trình đáng kể — đây là lựa chọn kinh tế và bền vững.</p>
      <h2>2. Kính tiết kiệm năng lượng Low-E</h2>
      <p>Kính Low-E với lớp phủ oxide kim loại phản xạ tới 70% bức xạ nhiệt mặt trời, giảm tải điều hòa không khí và tiết kiệm 20–40% chi phí điện năng. Đây là vật liệu bắt buộc cho các công trình xanh LEED và LOTUS tại Việt Nam.</p>
      <h2>3. Ngói năng lượng mặt trời tích hợp</h2>
      <p>Tích hợp tấm pin mặt trời trực tiếp vào vật liệu lợp mái, giải pháp này vừa che chắn vừa tạo ra điện năng cho hộ gia đình. Giá thành ngày càng cạnh tranh khi công nghệ được phổ biến rộng rãi hơn.</p>
      <h2>4. Vữa và sơn nano kháng khuẩn thế hệ mới</h2>
      <p>Các sản phẩm hoàn thiện tích hợp hạt nano bạc và titanium dioxide giúp bề mặt tự làm sạch, kháng khuẩn và phân hủy chất ô nhiễm khi tiếp xúc ánh sáng — đặc biệt phù hợp cho bệnh viện, trường học, không gian công cộng.</p>
      <h2>5. Bê tông tái chế từ phế liệu xây dựng</h2>
      <p>Sử dụng tro bay, xỉ lò cao và phế liệu bê tông nghiền làm cốt liệu thay thế một phần xi măng và cát tự nhiên. Giải pháp này giảm khí thải CO₂ trong sản xuất vật liệu xây dựng lên tới 40% so với phương pháp truyền thống.</p>
      <blockquote>"Công trình xanh không còn là câu chuyện của các tòa nhà triệu đô. Nhà ở dân dụng 3–4 tầng hoàn toàn có thể áp dụng 2–3 giải pháp xanh với chi phí tăng thêm chưa đến 10%." — KTS. Nguyễn Minh Trí.</blockquote>
    `
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
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Nhân kỷ niệm 8 năm thành lập và Tháng Tri Ân Khách Hàng, Moon VLXD triển khai chương trình ưu đãi đặc biệt dành cho tất cả đối tác, nhà thầu và khách hàng thân thiết trong toàn bộ tháng 5/2026.</p>
      <h2>Chi tiết các ưu đãi</h2>
      <ul>
        <li><strong>Ưu đãi 1 — Giảm thẳng tiền mặt:</strong> Đơn hàng thép hoặc xi măng từ 5 tấn trở lên được giảm ngay 2% trên tổng giá trị đơn hàng (tối đa 5.000.000đ/đơn).</li>
        <li><strong>Ưu đãi 2 — Voucher 500K:</strong> Mỗi đơn hàng từ 20 triệu đồng tặng kèm 1 voucher trị giá 500.000đ dùng cho lần mua tiếp theo.</li>
        <li><strong>Ưu đãi 3 — Miễn phí vận chuyển:</strong> Miễn hoàn toàn phí giao hàng cho đơn từ 10 tấn trong bán kính 20km nội thành TP.HCM.</li>
        <li><strong>Ưu đãi 4 — Chiết khấu combo:</strong> Mua kết hợp thép + xi măng + cát đá cùng lúc, chiết khấu thêm 1.5% so với mua riêng lẻ.</li>
      </ul>
      <h2>Điều kiện áp dụng</h2>
      <p>Chương trình áp dụng cho tất cả đơn hàng đặt trong thời gian từ 01/05/2026 đến hết 31/05/2026. Các ưu đãi có thể tích hợp cùng nhau trừ Ưu đãi 1 và Ưu đãi 4. Số lượng voucher giới hạn 500 voucher trong toàn chương trình, áp dụng theo thứ tự đặt hàng.</p>
      <blockquote>Liên hệ hotline hoặc nhắn tin Zalo để đặt hàng và nhận báo giá ưu đãi nhanh nhất. Đội ngũ kinh doanh Moon VLXD phục vụ 7 ngày/tuần, 7h–19h.</blockquote>
      <h2>Tại sao chọn Moon VLXD?</h2>
      <p>Với hệ thống kho bãi 5.000m², đội xe giao hàng riêng và mạng lưới cung ứng trực tiếp từ nhà máy, Moon VLXD đảm bảo hàng đúng chất lượng, đúng tiến độ và mức giá minh bạch nhất thị trường miền Nam.</p>
    `
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
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Chất lượng bê tông tươi là yếu tố nền tảng quyết định sức bền và độ an toàn của toàn bộ kết cấu công trình. Việc kiểm tra tại công trường trước khi đổ là quyền và trách nhiệm của chủ đầu tư — không thể bỏ qua dù công trình lớn hay nhỏ.</p>
      <h2>Bước 1: Kiểm tra hồ sơ xe bồn</h2>
      <p>Mỗi xe bồn bê tông phải có phiếu giao hàng ghi rõ: mác bê tông, thể tích, thời điểm trộn tại trạm và thời gian cho phép đổ tối đa (thường là 90 phút từ lúc trộn). Nếu xe đến muộn hoặc thiếu chứng từ, có quyền từ chối nhận hàng.</p>
      <h2>Bước 2: Thử độ sụt (Slump Test)</h2>
      <p>Đây là kiểm tra cơ bản nhất tại hiện trường. Dùng côn Abraham chuẩn (cao 30cm), đổ bê tông vào làm 3 lớp, mỗi lớp chọc 25 lần. Lật ngược côn, đo độ sụt (chênh lệch chiều cao). Mác bê tông dân dụng B25 thường yêu cầu độ sụt 10–18cm. Nếu ngoài khoảng cho phép, hãy từ chối xe hoặc yêu cầu kiểm tra lại tại trạm trộn.</p>
      <h2>Bước 3: Lấy mẫu thử nén chuẩn kỹ thuật</h2>
      <p>Lấy ít nhất 3 mẫu trụ (Ø150×300mm hoặc Ø100×200mm) cho mỗi 50m³ bê tông đổ. Bảo dưỡng mẫu đúng cách: giữ ẩm, tránh rung, không phơi nắng. Mẫu sẽ được gửi đến phòng thí nghiệm kiểm tra cường độ nén ở tuổi 7 ngày và 28 ngày.</p>
      <blockquote>"Nhiều chủ nhà bỏ qua kiểm tra vì nghĩ phức tạp. Thực tế, chỉ cần 15 phút và bộ côn Abraham (giá khoảng 200.000đ) là đủ để bảo vệ cả công trình trị giá hàng tỷ đồng." — Kỹ sư Kết cấu Moon VLXD.</blockquote>
      <h2>Các lỗi thường gặp cần tránh</h2>
      <ul>
        <li>Cho thêm nước vào xe bồn tại hiện trường — làm giảm mác bê tông nghiêm trọng.</li>
        <li>Đổ bê tông khi nhiệt độ ngoài trời trên 35°C hoặc dưới 10°C mà không có biện pháp bảo vệ.</li>
        <li>Không rung đầm bê tông hoặc rung đầm quá mức gây phân tầng vật liệu.</li>
      </ul>
    `
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
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Bê tông đạt cường độ thiết kế hay không phụ thuộc rất nhiều vào quá trình bảo dưỡng sau khi đổ. Theo tiêu chuẩn TCVN 4453:1995, bê tông phải được bảo dưỡng ẩm liên tục trong ít nhất 7 ngày đối với xi măng Portland thông thường.</p>
      <h2>Tại sao bảo dưỡng bê tông lại quan trọng?</h2>
      <p>Quá trình đông cứng của bê tông là phản ứng thủy hóa — xi măng kết hợp với nước tạo ra cường độ. Nếu bê tông mất nước quá nhanh do gió, nắng hoặc nhiệt độ cao, phản ứng thủy hóa bị gián đoạn, dẫn đến giảm cường độ nén thực tế so với thiết kế, nứt co ngót bề mặt và nguy cơ thấm nước sau này.</p>
      <h2>Lịch trình bảo dưỡng theo từng ngày</h2>
      <ul>
        <li><strong>Ngày 1–2:</strong> Phủ bạt/vải giữ ẩm ngay sau khi bê tông se mặt (khoảng 4–6 giờ sau đổ). Tưới nước nhẹ khi tháo bạt, tránh tia nước mạnh làm xói bề mặt.</li>
        <li><strong>Ngày 3–7:</strong> Tưới nước tối thiểu 3 lần/ngày (sáng, trưa, chiều tối). Ngày nắng nóng trên 32°C cần tưới 5–6 lần. Duy trì phủ bạt giữa các lần tưới.</li>
        <li><strong>Ngày 7–14:</strong> Có thể giảm tần suất tưới nhưng vẫn giữ ẩm, đặc biệt ban ngày nắng. Bê tông mác cao (B30, B35) khuyến nghị bảo dưỡng đến 28 ngày.</li>
      </ul>
      <blockquote>"Sàn bê tông bị nứt chân chim sau thi công trong 90% trường hợp là do bảo dưỡng không đúng cách, không phải do chất lượng bê tông." — KS. Trần Văn Hùng, Giám sát công trình Moon VLXD.</blockquote>
      <h2>Sản phẩm dưỡng ẩm thay thế tưới nước</h2>
      <p>Trong điều kiện không thể tưới nước liên tục (thi công tầng cao, thời tiết cực đoan), có thể sử dụng màng dưỡng ẩm Curing Compound phun lên bề mặt bê tông ngay sau khi se mặt. Sản phẩm phổ biến được khuyến nghị: Sika Antisol E, Master Cure 111.</p>
    `
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
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Thép cuộn phi 6 và phi 8 là hai loại thép xây dựng phổ biến nhất trong các công trình dân dụng, được dùng làm thép đai cột, thép lưới sàn và thép đai dầm. Lựa chọn đúng thương hiệu và chủng loại ảnh hưởng trực tiếp đến chất lượng và dự toán công trình.</p>
      <h2>So sánh đặc tính kỹ thuật các thương hiệu</h2>
      <ul>
        <li><strong>Hòa Phát CB240-T</strong> — Giới hạn chảy ≥240 MPa, bề mặt trơn, dung sai ±0.3mm. Sản xuất tại Dung Quất theo dây chuyền hiện đại. Phù hợp công trình tiêu chuẩn, giá ưu thế.</li>
        <li><strong>Pomina SD295A</strong> — Giới hạn chảy ≥295 MPa, bề mặt vằn gai, độ bền kéo đứt cao hơn. Phù hợp công trình cần cốt thép chịu lực cao, đặc biệt kết cấu chịu động đất.</li>
        <li><strong>VAS SD295A</strong> — Tương đương Pomina về cấp độ bền, giá thường thấp hơn 3–5%. Nguồn cung ổn định tại thị trường miền Nam, giao hàng nhanh.</li>
      </ul>
      <h2>So sánh giá thị trường tháng 4/2026</h2>
      <ul>
        <li>Hòa Phát phi 6: ~14.500 đ/kg | phi 8: ~14.200 đ/kg</li>
        <li>Pomina phi 6: ~14.800 đ/kg | phi 8: ~14.500 đ/kg</li>
        <li>VAS phi 6: ~14.300 đ/kg | phi 8: ~14.000 đ/kg</li>
      </ul>
      <blockquote>Liên hệ Moon VLXD để nhận báo giá cập nhật nhất theo khối lượng thực tế công trình của bạn. Cam kết cạnh tranh so với mọi đại lý cùng cấp.</blockquote>
      <h2>Khuyến nghị chọn thương hiệu theo loại công trình</h2>
      <p>Cho công trình dân dụng thông thường (nhà phố 3–5 tầng), thép Hòa Phát CB240-T hoặc VAS SD295A là lựa chọn tối ưu về giá–chất lượng. Cho công trình có yêu cầu kỹ thuật cao, thiết kế kháng chấn hoặc công trình cao tầng, nên ưu tiên Pomina SD295A hoặc các loại thép cấp cao hơn theo chỉ định của kỹ sư thiết kế.</p>
    `
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
    image: "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Tường ngoài là tuyến phòng thủ đầu tiên của ngôi nhà trước mưa gió nhiệt đới. Với lượng mưa trung bình 1.800–2.000mm/năm tại TP.HCM, hệ thống chống thấm tường ngoài phải được thiết kế và thi công đúng kỹ thuật để đảm bảo hiệu quả 10–15 năm.</p>
      <h2>Nguyên nhân thấm tường ngoài thường gặp</h2>
      <ul>
        <li>Vữa trát tường có vết nứt chân chim do co ngót nhiệt hoặc bảo dưỡng kém.</li>
        <li>Mạch nối tường–cột–dầm bị hở do co giãn nhiệt độ theo mùa.</li>
        <li>Lớp sơn ngoài trời bong tróc theo thời gian, để hở bề mặt vữa tiếp xúc trực tiếp với mưa.</li>
        <li>Chi tiết kỹ thuật như lỗ thoát nước bệ cửa sổ, mặt sảnh tầng không được xử lý chống thấm riêng.</li>
      </ul>
      <h2>Hệ chống thấm tường ngoài 3 lớp tiêu chuẩn</h2>
      <p><strong>Lớp 1 — Trám và xử lý vết nứt:</strong> Đục rộng vết nứt thành chữ V, thổi sạch bụi và trám bằng vữa polymer (Sika MonoTop 612 hoặc Kova CT-11A). Với vết nứt động, dùng keo polyurethane đàn hồi như Sikaflex 11FC.</p>
      <p><strong>Lớp 2 — Quét chống thấm gốc xi măng (2 lớp):</strong> Sản phẩm như Sika Waterproof hoặc Kova CT-16A pha theo tỷ lệ hướng dẫn. Quét lớp 1, để khô 4–6 giờ, quét vuông góc lớp 2. Lớp này bịt kín mao quản trong vữa.</p>
      <p><strong>Lớp 3 — Sơn ngoài trời chống thấm bền màu:</strong> Chọn sơn đàn hồi (elastomeric) như Dulux Weathershield, Jotun Jotashield Extreme hoặc Kansai WeatherGuard. Sơn 2 lớp phủ hoàn thiện sau khi lớp chống thấm đủ khô.</p>
      <blockquote>"Bỏ qua bước trám vết nứt là sai lầm phổ biến nhất. Dù sơn tốt đến đâu, nước vẫn tìm đường qua vết nứt nếu không được xử lý triệt để trước." — KS. Lê Thanh Minh, Chuyên gia chống thấm.</blockquote>
    `
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
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Xi măng kém chất lượng hoặc hàng giả là vấn đề nghiêm trọng đang gây thiệt hại lớn cho người tiêu dùng. Theo thống kê của cơ quan chức năng, có đến 15–20% xi măng lưu thông tại kênh bán lẻ tự do không đạt tiêu chuẩn TCVN 2682.</p>
      <h2>7 dấu hiệu nhận biết xi măng kém chất lượng</h2>
      <ul>
        <li><strong>Bao bì không rõ ràng</strong> — Logo nhòe, chữ in mờ, thiếu thông tin nhà sản xuất, mã lô hàng, ngày sản xuất.</li>
        <li><strong>Khối lượng sai</strong> — Cân kiểm tra thấy bao 50kg chỉ đạt 47–48kg là hiện tượng phổ biến.</li>
        <li><strong>Màu sắc bất thường</strong> — Xi măng chuẩn có màu xám xanh đồng nhất. Màu nâu, vàng hoặc loang lổ cần nghi ngờ.</li>
        <li><strong>Vón cục</strong> — Sờ vào thấy cục cứng chứng tỏ xi măng bị ẩm hoặc quá hạn. Xi măng tốt phải mịn, mát tay.</li>
        <li><strong>Thiếu tem hologram chống giả</strong> — Các thương hiệu uy tín đều có tem hologram trên bao bì có thể xác minh.</li>
        <li><strong>Nguồn gốc không rõ</strong> — Mua từ cơ sở bán lẻ nhỏ không có hợp đồng đại lý chính thức của nhà sản xuất.</li>
        <li><strong>Giá quá rẻ bất thường</strong> — Giá thấp hơn 15–20% so với thị trường là dấu hiệu cần cảnh giác cao.</li>
      </ul>
      <h2>3 cách kiểm tra nhanh không cần thiết bị</h2>
      <p><strong>Test cảm quan:</strong> Cầm một nắm xi măng trong lòng bàn tay, siết nhẹ. Xi măng tốt tạo dấu ngón tay rõ và cảm giác mát. Xi măng kém chất lượng dễ vón, nóng tay hoặc có mùi lạ.</p>
      <p><strong>Test trộn nước nhỏ:</strong> Trộn một lượng nhỏ xi măng với nước thành viên bi. Sau 24 giờ ở nhiệt độ phòng, viên bi đạt chất lượng sẽ cứng và khó vỡ khi bóp. Viên bi mềm nhũn hoặc rã ra là dấu hiệu xi măng kém.</p>
      <p><strong>Kiểm tra CO/CQ:</strong> Yêu cầu đại lý cung cấp chứng chỉ xuất xứ và chứng chỉ chất lượng theo từng lô hàng. Đây là điều kiện bắt buộc với mọi công trình có giá trị.</p>
      <blockquote>Moon VLXD cam kết 100% xi măng xuất kho có đầy đủ CO/CQ, tem chống giả hologram và được kiểm tra chất lượng nội bộ trước khi giao đến tay khách hàng.</blockquote>
    `
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
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Nhà phố hẻm với mặt tiền 3–4m, sâu 10–15m là bài toán thiết kế phổ biến nhất tại TP.HCM. Với diện tích đất hạn chế, mỗi tấm tường và mỗi kết cấu đều cần được tối ưu để tối đa hóa không gian sử dụng thực tế.</p>
      <h2>Ưu điểm của khung thép nhẹ cho nhà hẻm</h2>
      <p>Hệ khung thép nhẹ (Light Gauge Steel) đang được ứng dụng rộng rãi cho nhà hẻm 3–6 tầng. So với khung bê tông cốt thép truyền thống, khung thép nhẹ cho phép tường mỏng hơn 5–8cm mỗi bên — cộng dồn trên nhiều tầng có thể "lấy lại" 1–2m² sàn sử dụng, tương đương một góc làm việc hay khu vệ sinh riêng.</p>
      <h2>Gạch block AAC — Lựa chọn tường ngăn tối ưu</h2>
      <p>Gạch bê tông khí chưng áp (AAC) dày 10–15cm thay thế tường gạch đặc dày 20cm, giảm tải trọng sàn và móng 40–50%. Đặc biệt, AAC có khả năng cách nhiệt và cách âm tốt hơn gạch đặc truyền thống — phù hợp cho nhà phố thành phố ồn ào và nóng bức.</p>
      <h2>Các giải pháp panel và vách ngăn linh hoạt</h2>
      <ul>
        <li><strong>Panel EPS (xốp lõi thép):</strong> Dày 75–100mm, cách nhiệt tốt, thi công lắp ghép nhanh gấp 3 lần xây gạch. Phù hợp tầng áp mái hoặc tầng kỹ thuật.</li>
        <li><strong>Vách thạch cao khung thép:</strong> Phổ biến cho nội thất, dày chỉ 75–100mm, cách âm tốt khi dùng bông thủy tinh lõi bên trong.</li>
        <li><strong>Panel bê tông nhẹ precast:</strong> Thi công lắp ghép, giảm thời gian xây dựng 30–40%, phù hợp tiến độ gấp.</li>
      </ul>
      <blockquote>"Với nhà hẻm 3m, từng cm đều có giá trị. Chuyển từ tường gạch 20cm sang AAC 10cm cho tất cả tường ngăn, bạn có thêm ~8m² sàn sử dụng cho một căn 3 tầng — tương đương một phòng ngủ nhỏ." — KTS. Phạm Thu Hà.</blockquote>
    `
  }
];

// ── HELPERS ────────────────────────────────────────────────────────────────────

/** Inject IDs into h2/h3 headings and build TOC entries */
const processContent = (html) => {
  if (!html) return { processedHtml: html || '', toc: [] };
  const toc = [];
  let i = 0;
  const processedHtml = html.replace(
    /<h([23])([^>]*)>([^<]*)<\/h\1>/gi,
    (_, level, attrs, text) => {
      const id = `nd-h-${i++}`;
      toc.push({ id, text: text.trim(), level: parseInt(level, 10) });
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
  );
  return { processedHtml, toc };
};

// ── COMPONENT ──────────────────────────────────────────────────────────────────
const NewsDetail = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();

  const [article,       setArticle]      = useState(null);
  const [readProgress,  setReadProgress] = useState(0);
  const [activeHeading, setActiveHead]   = useState(null);
  const [copied,        setCopied]       = useState(false);

  /* ── load article ── */
  useEffect(() => {
    window.scrollTo(0, 0);
    const found = newsData.find(item => item.id === parseInt(id, 10));
    setArticle(found || null);
  }, [id]);

  /* ── process html + toc ── */
  const { processedHtml, toc } = useMemo(
    () => article?.content ? processContent(article.content) : { processedHtml: '', toc: [] },
    [article]
  );

  /* ── related articles (same category first, fill with others) ── */
  const relatedArticles = useMemo(() => {
    if (!article) return [];
    const sameCat = newsData.filter(a => a.id !== article.id && a.category === article.category);
    const others  = newsData.filter(a => a.id !== article.id && a.category !== article.category);
    return [...sameCat, ...others].slice(0, 3);
  }, [article]);

  /* ── reading progress ── */
  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const top = el.scrollTop || document.body.scrollTop;
      const h   = el.scrollHeight - el.clientHeight;
      setReadProgress(h > 0 ? (top / h) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── active TOC heading ── */
  useEffect(() => {
    if (!toc.length) return;
    const onScroll = () => {
      for (let k = toc.length - 1; k >= 0; k--) {
        const el = document.getElementById(toc[k].id);
        if (el && el.getBoundingClientRect().top <= 110) {
          setActiveHead(toc[k].id);
          return;
        }
      }
      setActiveHead(null);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [toc]);

  /* ── helpers ── */
  const scrollToHeading = (headingId) => {
    const el = document.getElementById(headingId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── error state ── */
  if (!article) {
    return (
      <div className="nd-error-page">
        <div className="nd-error-icon"><i className="far fa-newspaper" /></div>
        <h2>Không tìm thấy bài viết</h2>
        <p>Bài viết bạn tìm kiếm không tồn tại hoặc đã bị gỡ xuống.</p>
        <button className="nd-back-btn" onClick={() => navigate('/news')}>
          <i className="fas fa-arrow-left" /> Quay lại trang tin tức
        </button>
      </div>
    );
  }

  const catColor = CATEGORY_COLORS[article.category] || 'var(--gold-500)';

  return (
    <>
      {/* ── READING PROGRESS ─────────────────────────────── */}
      <div
        className="nd-progress-bar"
        style={{ width: `${readProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="nd-hero">
        <img src={article.image} alt={article.title} className="nd-hero-img" />
        <div className="nd-hero-overlay">
          <span className="nd-hero-cat" style={{ background: catColor }}>
            {article.category}
          </span>
          <h1 className="nd-hero-title">{article.title}</h1>
          <div className="nd-hero-meta">
            <span className="nd-hero-meta-item">
              <i className="far fa-calendar-alt" />
              {article.date}
            </span>
            <span className="nd-hero-meta-item">
              <i className="far fa-user" />
              {article.author}
            </span>
            {article.readTime && (
              <span className="nd-hero-meta-item">
                <i className="far fa-clock" />
                {article.readTime} đọc
              </span>
            )}
            {article.views && (
              <span className="nd-hero-meta-item">
                <i className="far fa-eye" />
                {article.views} lượt xem
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── BREADCRUMB ────────────────────────────────────── */}
      <div className="nd-breadcrumb-wrap">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <i className="fas fa-chevron-right" />
          <Link to="/news">Tin tức</Link>
          <i className="fas fa-chevron-right" />
          <span>{article.category}</span>
        </nav>
      </div>

      {/* ── MAIN LAYOUT ───────────────────────────────────── */}
      <div className="nd-layout">

        {/* ── ARTICLE BODY ── */}
        <main className="nd-main">
          <div
            className="nd-content"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />

          {/* ── ARTICLE FOOTER ── */}
          <div className="nd-article-footer">

            {/* Author card */}
            <div className="nd-author-card">
              <div className="nd-author-avatar" aria-hidden="true">
                {article.author.charAt(0).toUpperCase()}
              </div>
              <div className="nd-author-info">
                <h4>{article.author}</h4>
                <span>Biên tập viên · Moon VLXD</span>
              </div>
            </div>

            {/* Share */}
            <div className="nd-share-row">
              <span className="nd-share-label">Chia sẻ bài viết:</span>
              <div className="nd-share-btns">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nd-share-btn fb"
                  aria-label="Chia sẻ Facebook"
                >
                  <i className="fab fa-facebook-f" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nd-share-btn tw"
                  aria-label="Chia sẻ Twitter"
                >
                  <i className="fab fa-twitter" />
                </a>
                <button
                  className="nd-share-btn lk"
                  onClick={copyLink}
                  aria-label={copied ? 'Đã copy' : 'Copy đường dẫn'}
                  title={copied ? 'Đã copy!' : 'Copy link'}
                >
                  <i className={copied ? 'fas fa-check' : 'fas fa-link'} />
                </button>
              </div>
            </div>

          </div>
        </main>

        {/* ── SIDEBAR ── */}
        <aside className="nd-sidebar">

          {/* Table of contents */}
          {toc.length > 0 && (
            <div className="nd-widget">
              <div className="nd-widget-title">
                <i className="fas fa-list-ul" /> Nội dung bài viết
              </div>
              <ul className="nd-toc-list" role="navigation" aria-label="Mục lục">
                {toc.map(item => (
                  <li
                    key={item.id}
                    className={`nd-toc-item level-${item.level}${activeHeading === item.id ? ' active' : ''}`}
                    onClick={() => scrollToHeading(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && scrollToHeading(item.id)}
                  >
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related in sidebar */}
          {relatedArticles.length > 0 && (
            <div className="nd-widget">
              <div className="nd-widget-title">
                <i className="fas fa-newspaper" /> Bài viết liên quan
              </div>
              <div className="nd-sidebar-related">
                {relatedArticles.map(rel => (
                  <Link key={rel.id} to={`/news/${rel.id}`} className="nd-sidebar-card">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="nd-sidebar-img"
                      loading="lazy"
                    />
                    <div className="nd-sidebar-info">
                      <div className="nd-sidebar-title">{rel.title}</div>
                      <div className="nd-sidebar-date">
                        <i className="far fa-calendar-alt" />
                        {rel.date}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="nd-cta-widget">
            <div className="nd-cta-icon">📦</div>
            <h4>Cần báo giá nhanh?</h4>
            <p>Đội ngũ tư vấn Moon VLXD hỗ trợ miễn phí, 7 ngày/tuần từ 7h–19h.</p>
            <a href="tel:19001234" className="nd-cta-btn">
              <i className="fas fa-phone-alt" /> Gọi ngay
            </a>
          </div>

        </aside>
      </div>

      {/* ── BACK BUTTON ───────────────────────────────────── */}
      <div className="nd-back-bar">
        <button className="nd-back-btn" onClick={() => navigate('/news')}>
          <i className="fas fa-arrow-left" /> Trở về danh sách tin tức
        </button>
      </div>

      {/* ── RELATED ARTICLES (bottom grid) ───────────────── */}
      {relatedArticles.length > 0 && (
        <section className="nd-related-section">
          <div className="nd-section-head">
            <h3>Bài Viết Liên Quan</h3>
            <div className="nd-section-line" />
          </div>
          <div className="nd-related-grid">
            {relatedArticles.map(rel => (
              <Link key={rel.id} to={`/news/${rel.id}`} className="nd-related-card">
                <div className="nd-related-img-wrap">
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="nd-related-img"
                    loading="lazy"
                  />
                  <span
                    className="nd-related-cat"
                    style={{ background: CATEGORY_COLORS[rel.category] || 'var(--gold-500)' }}
                  >
                    {rel.category}
                  </span>
                </div>
                <div className="nd-related-body">
                  <div className="nd-related-title">{rel.title}</div>
                  <div className="nd-related-meta">
                    <span>
                      <i className="far fa-calendar-alt" /> {rel.date}
                    </span>
                    {rel.readTime && (
                      <span>
                        <i className="far fa-clock" /> {rel.readTime}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default NewsDetail;
