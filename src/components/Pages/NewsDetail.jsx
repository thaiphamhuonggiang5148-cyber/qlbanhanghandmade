import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './NewsDetail.css';


const CATEGORY_COLORS = {
  "Thị trường":  "#e74c3c",
  "Sự kiện":     "#2980b9",
  "Kinh nghiệm": "#27ae60",
  "Báo giá":     "#e67e22",
  "Xu hướng":    "#8e44ad",
  "Khuyến mãi":  "#c0392b",
};


const newsData = [
  {
    id: 1,
    title: "Xu hướng decor handmade quý III/2026: Trở về với vẻ đẹp mộc mạc",
    excerpt: "Năm 2026 chứng kiến sự lên ngôi của phong cách nội thất tối giản kết hợp với các món đồ thủ công độc bản. SoulMade cùng bà khám phá những chất liệu tự nhiên đang làm say lòng giới mộ điệu decor.",
    category: "Góc cảm hứng",
    date: "29/05/2026",
    author: "SoulMade Team",
    readTime: "5 phút",
    views: "1.2k",
    featured: true,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Thị trường decor handmade đang có những bước chuyển mình đầy thú vị. Không còn chuộng sự công nghiệp bóng bẩy, người dùng hiện nay ưu tiên những món đồ mang đậm dấu ấn cá nhân và hơi thở của thiên nhiên.</p>
      <h2>Tại sao đồ thủ công lại lên ngôi?</h2>
      <p>Sự tinh tế không nằm ở sự hoàn hảo tuyệt đối, mà nằm ở sự chăm chút trong từng đường nét. Các chất liệu như gốm thủ công, sợi đan tự nhiên và gỗ mộc đang trở thành linh hồn của những ngôi nhà hiện đại. SoulMade thấu hiểu rằng, mỗi món đồ bà chọn không chỉ để trang trí, mà còn là cách bà kể câu chuyện về phong cách sống an yên của chính mình.</p>
      <blockquote>"Mỗi sản phẩm thủ công đều mang theo năng lượng tích cực từ đôi bàn tay của người nghệ nhân, giúp không gian sống trở nên có chiều sâu hơn." — Chia sẻ từ Founder SoulMade.</blockquote>
      <h2>Dự báo phong cách decor nổi bật quý III/2026</h2>
      <p>Phong cách Rustic kết hợp với tinh thần tối giản (Minimalism) sẽ tiếp tục dẫn đầu. Màu sắc chủ đạo hướng về các gam màu trung tính của đất, gỗ và lá khô. Những món đồ handmade như bình gốm mộc, túi đan macrame hay nến thơm từ sáp đậu nành sẽ là điểm nhấn không thể thiếu.</p>
      <h2>Gợi ý từ SoulMade cho không gian của bà</h2>
      <ul>
        <li>Tận dụng ánh sáng tự nhiên để tôn lên các món đồ decor bằng gốm hoặc gỗ.</li>
        <li>Kết hợp các loại cây xanh nhỏ để không gian thêm phần "thở" và gần gũi.</li>
        <li>Ưu tiên chọn những món đồ thủ công có tính ứng dụng cao nhưng vẫn giữ được nét nghệ thuật độc bản.</li>
        <li>Hãy để mỗi món đồ tại SoulMade trở thành một mảnh ghép hoàn hảo cho tâm hồn bà.</li>
      </ul>
      <p>SoulMade luôn ở đây để cùng bà tạo nên không gian sống đầy cảm hứng. Liên hệ với chúng tui để được tư vấn thiết kế góc decor riêng cho căn nhà nhỏ của bà nhé!</p>
    `
  },
  {
    id: 2,
    title: "SoulMade chính thức ra mắt bộ sưu tập 'Chạm vào An Yên'",
    excerpt: "Lấy cảm hứng từ những khoảnh khắc tĩnh lặng trong cuộc sống, SoulMade vừa giới thiệu bộ sưu tập thủ công mới nhất. Đây là tâm huyết của chúng tui dành tặng cho những tâm hồn yêu cái đẹp mộc mạc.",
    category: "Ra mắt",
    date: "25/05/2026",
    author: "Hương Giang",
    readTime: "4 phút",
    views: "876",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Ngày 24/05/2026, SoulMade hân hoan giới thiệu đến bà bộ sưu tập mang tên "Chạm vào An Yên". Đây không chỉ là sản phẩm, mà là sự kết tinh từ tình yêu dành cho nghệ thuật thủ công và sự trân trọng những giá trị bình dị.</p>
      <h2>Ý nghĩa bộ sưu tập "Chạm vào An Yên"</h2>
      <p>Giữa nhịp sống vội vã, SoulMade mong muốn tạo ra những món đồ giúp bà dừng lại một chút, tận hưởng vẻ đẹp của sự tĩnh lặng. Từ những chiếc bình gốm được nung trong lò, cho đến những chiếc túi được móc bằng sợi bông tự nhiên, tất cả đều mang theo hơi ấm của sự tỉ mỉ.</p>
      <blockquote>"Bộ sưu tập này chính là những mảnh ghép an yên mà SoulMade muốn gửi trao đến ngôi nhà của bà." — Hương Giang, người sáng lập SoulMade.</blockquote>
      <h2>Tại sao bà sẽ yêu thích các sản phẩm này?</h2>
      <p>Mỗi món đồ trong "Chạm vào An Yên" đều có câu chuyện riêng biệt:</p>
      <ul>
        <li><strong>Chất liệu thuần khiết:</strong> Sử dụng 100% nguyên liệu thân thiện với môi trường và an toàn cho sức khỏe.</li>
        <li><strong>Độc bản:</strong> Vì là đồ làm tay, nên không có hai sản phẩm nào giống hệt nhau, giống như nét cá tính riêng của bà vậy.</li>
        <li><strong>Chăm chút từng chi tiết:</strong> Từng nút thắt, từng nét vẽ đều được hoàn thiện bởi sự tỉ mỉ nhất.</li>
        <li><strong>Bao bì tinh tế:</strong> Mỗi món hàng khi đến tay bà đều được gói ghém bằng cả tấm lòng, xứng đáng làm một món quà ý nghĩa.</li>
      </ul>
      <h2>Cùng SoulMade lan tỏa yêu thương</h2>
      <p>Trong tháng ra mắt này, SoulMade dành tặng ưu đãi đặc biệt cho những đơn hàng sớm nhất. Chi tiết về các sản phẩm trong bộ sưu tập đã có trên website. Đừng ngần ngại nhắn tin cho chúng tui nếu bà muốn gửi gắm lời nhắn yêu thương kèm theo món quà này nhé!</p>
    `
  },
 {
    id: 3,
    title: "Kinh nghiệm chọn món đồ decor 'đúng gu' cho căn phòng nhỏ",
    excerpt: "Làm sao để căn phòng nhỏ trở nên ấm cúng mà không bị bí bách? SoulMade chia sẻ bí quyết chọn đồ decor thủ công để tối ưu diện tích và tạo điểm nhấn nghệ thuật riêng biệt.",
    category: "Mẹo nhỏ",
    date: "20/05/2026",
    author: "SoulMade Care",
    readTime: "7 phút",
    views: "2.4k",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Decor cho không gian nhỏ luôn là một bài toán thú vị. Thay vì chạy theo số lượng, SoulMade tin rằng chỉ cần vài món đồ thủ công tinh tế đặt đúng chỗ, căn phòng của bà sẽ mang một "hơi thở" hoàn toàn mới.</p>
      <h2>Nguyên tắc lựa chọn đồ decor theo "tâm hồn" không gian</h2>
      <p>Không gian sống cũng có tính cách, và việc chọn đồ decor cũng giống như chọn phụ kiện cho chính mình vậy. Hãy ưu tiên những món đồ có sự kết nối về màu sắc và chất liệu:</p>
      <ul>
        <li><strong>Không gian tối giản (Minimalist):</strong> Hợp với gốm sứ màu trắng kem, be, hoặc đồ gỗ màu sáng. Sự đơn giản tạo nên chiều sâu.</li>
        <li><strong>Không gian Vintage/Retro:</strong> Phù hợp với những món đồ móc len, thảm dệt có họa tiết thổ cẩm, màu sắc trầm ấm.</li>
        <li><strong>Góc học tập/Làm việc:</strong> Ưu tiên những món nhỏ nhắn như lọ hoa gốm mini, kệ gỗ treo tường để tiết kiệm không gian.</li>
        <li><strong>Góc thư giãn:</strong> Không thể thiếu nến thơm thiên nhiên hoặc những chiếc gối tựa được may tỉ mỉ.</li>
      </ul>
      <h2>Sai lầm thường gặp khi trang trí nhà cửa</h2>
      <p>Nhiều bà thường mắc lỗi mua quá nhiều đồ handmade mà không có sự liên kết, khiến không gian bị rối mắt. Hãy nhớ:</p>
      <ul>
        <li><strong>Đừng tham quá nhiều chi tiết:</strong> Chỉ nên chọn 1-2 món đồ làm điểm nhấn (focal point) cho mỗi góc phòng.</li>
        <li><strong>Ánh sáng là chìa khóa:</strong> Dù đồ handmade đẹp đến đâu, nếu đặt trong góc tối cũng sẽ mất đi vẻ đẹp. Hãy tận dụng ánh sáng tự nhiên.</li>
        <li><strong>Chất lượng hơn số lượng:</strong> Một chiếc bình gốm được nghệ nhân làm kỹ càng sẽ có giá trị thẩm mỹ cao hơn nhiều lần so với hàng loạt món đồ nhựa công nghiệp.</li>
      </ul>
      <blockquote>"Ngôi nhà đẹp nhất là ngôi nhà khiến bà cảm thấy được là chính mình mỗi khi trở về." — SoulMade.</blockquote>
      <h2>Mẹo tối ưu ngân sách decor</h2>
      <p>Bà không cần thay mới toàn bộ nội thất. Hãy bắt đầu bằng cách thay đổi những chi tiết nhỏ như thay vỏ gối, đổi bình hoa, hoặc thêm một vài tấm ảnh treo tường. Chỉ cần thay đổi nhỏ cũng đủ tạo nên sự khác biệt lớn cho ngân sách của bà.</p>
    `
  },
  {
    id: 4,
    title: "Hướng dẫn chăm sóc đồ handmade để 'trường tồn' với thời gian",
    excerpt: "Đồ handmade là những tác phẩm cần sự nâng niu. Cùng SoulMade điểm qua những lưu ý 'vàng' để giữ gìn các món đồ thủ công yêu quý luôn đẹp như mới.",
    category: "Chăm sóc",
    date: "15/05/2026",
    author: "SoulMade Tips",
    readTime: "3 phút",
    views: "3.1k",
    image: "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Mỗi món đồ tại SoulMade đều là kết tinh của thời gian và công sức. Để chúng luôn đẹp như ngày đầu tiên bà đón về nhà, hãy dành chút thời gian "lắng nghe" và chăm sóc chúng đúng cách.</p>
      <h2>Chăm sóc đồ gốm và các sản phẩm đất nung</h2>
      <ul>
        <li><strong>Vệ sinh:</strong> Chỉ nên dùng khăn mềm hoặc bọt biển cùng xà phòng dịu nhẹ để rửa. Tránh dùng miếng cọ kim loại làm xước bề mặt.</li>
        <li><strong>Bảo quản:</strong> Gốm rất kỵ sốc nhiệt, tránh thay đổi nhiệt độ đột ngột (đang nóng cho vào nước lạnh).</li>
      </ul>
      <h2>Chăm sóc đồ dệt may, len và túi xách</h2>
      <ul>
        <li><strong>Giặt tay là chân ái:</strong> Hạn chế tối đa máy giặt để không làm hỏng cấu trúc sợi. Dùng nước giặt trung tính và vò nhẹ tay.</li>
        <li><strong>Phơi phóng:</strong> Nên phơi trong bóng râm, tránh ánh nắng trực tiếp khiến màu sắc bị phai và sợi vải trở nên khô cứng.</li>
      </ul>
      <blockquote>Đồ thủ công giống như một người bạn, nếu bà đối xử tử tế, nó sẽ gắn bó với bà thật bền lâu.</blockquote>
      <h2>Lưu ý cho sản phẩm từ gỗ và nến thơm</h2>
      <p>Sản phẩm gỗ cần được lau dầu bảo dưỡng định kỳ để giữ độ bóng. Với nến thơm, hãy luôn cắt bấc nến trước khi đốt để ngọn lửa cháy đều và không làm đen thành hũ.</p>
      <p>Nếu trong quá trình sử dụng có bất kỳ hư hại nào, đừng vứt bỏ chúng đi! Hãy nhắn cho SoulMade, chúng tui luôn sẵn lòng tư vấn cách phục hồi để món đồ của bà trở lại vẻ đẹp ban đầu.</p>
    `
  },
  {
    id: 5,
    title: "5 xu hướng decor 'xanh' đang thay đổi không gian sống của người Việt",
    excerpt: "Đồ gốm thủ công, vải sợi tự nhiên, nến thơm hữu cơ và lối sống tối giản đang dần thay thế những món đồ trang trí công nghiệp. Xu hướng sống xanh không còn là xa xỉ mà là tiêu chuẩn của sự tinh tế.",
    category: "Xu hướng",
    date: "10/05/2026",
    author: "SoulMade Studio",
    readTime: "6 phút",
    views: "1.8k",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Không gian sống của người Việt đang có sự chuyển dịch mạnh mẽ sang lối sống xanh và bền vững. Đây không chỉ là xu hướng toàn cầu mà còn là cách chúng ta tìm lại sự cân bằng sau những ngày làm việc vội vã.</p>
      <h2>1. Đồ gốm thủ công — Vẻ đẹp của sự không hoàn hảo</h2>
      <p>Thay vì sử dụng đồ nhựa hay gốm sứ công nghiệp, người tiêu dùng đang tìm về với gốm thủ công. Mỗi món đồ có một nét riêng biệt, mang trong mình tâm huyết của nghệ nhân, giúp ngôi nhà trở nên gần gũi và đầy cảm xúc hơn.</p>
      <h2>2. Vải sợi tự nhiên (Cotton, Linen)</h2>
      <p>Sử dụng các loại vải như linen hay cotton tự nhiên trong trang trí (rèm cửa, vỏ gối, khăn trải bàn) không chỉ tạo cảm giác thoáng mát, nhẹ nhàng mà còn cực kỳ thân thiện với môi trường.</p>
      <h2>3. Nến thơm từ sáp đậu nành thiên nhiên</h2>
      <p>Thay vì các loại nến paraphin hóa chất, nến thơm sáp đậu nành (soy wax) với tinh dầu tự nhiên đang trở thành "vật bất ly thân" trong phòng ngủ, giúp thanh lọc không khí và thư giãn tinh thần hiệu quả.</p>
      <h2>4. Decor "xanh" từ vật liệu tái chế</h2>
      <p>Việc biến tấu các món đồ cũ, giấy tái chế hay gỗ pallet thành vật dụng trang trí độc đáo là cách tuyệt vời để giảm thiểu rác thải và thể hiện cá tính riêng của gia chủ.</p>
      <h2>5. Đồ nội thất đa năng từ vật liệu tự nhiên</h2>
      <p>Sử dụng các món đồ nhỏ nhắn, đa năng làm từ mây, tre hoặc gỗ mộc giúp tiết kiệm diện tích cho các căn hộ chung cư hiện đại, đồng thời vẫn giữ được sự sang trọng, ấm cúng.</p>
      <blockquote>"Sống xanh không phải là điều gì quá to tát, nó bắt đầu từ chính những món đồ nhỏ xinh mà bà lựa chọn đặt trong không gian sống mỗi ngày." — SoulMade Team.</blockquote>
    `
  },
  {
    id: 6,
    title: "Tri ân tháng 5: SoulMade tặng bà ưu đãi 'Trao gửi yêu thương'",
    excerpt: "SoulMade tung gói ưu đãi đặc biệt: Giảm ngay 15% cho hóa đơn từ 500k, tặng kèm nến thơm mini và miễn phí gói quà sang trọng. Số lượng ưu đãi có hạn chỉ trong tháng này!",
    category: "Khuyến mãi",
    date: "01/05/2026",
    author: "SoulMade Team",
    readTime: "2 phút",
    views: "4.5k",
    hot: true,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Nhân kỷ niệm hành trình đồng hành cùng những tâm hồn yêu cái đẹp, SoulMade gửi đến bà chương trình tri ân đặc biệt như một lời cảm ơn chân thành vì đã luôn yêu thương và ủng hộ chúng tui suốt thời gian qua.</p>
      <h2>Chi tiết các ưu đãi trong tháng 5</h2>
      <ul>
        <li><strong>Ưu đãi 1 — Giảm thẳng hóa đơn:</strong> Giảm trực tiếp 15% cho mọi hóa đơn mua sắm từ 500.000đ trở lên.</li>
        <li><strong>Ưu đãi 2 — Món quà nhỏ xinh:</strong> Tặng ngay 01 nến thơm mini handmade cho mỗi đơn hàng từ 1.000.000đ.</li>
        <li><strong>Ưu đãi 3 — Gói quà tinh tế:</strong> Miễn phí gói quà "Chạm vào an yên" với thiệp viết tay cho khách hàng có yêu cầu.</li>
        <li><strong>Ưu đãi 4 — Freeship nhẹ nhàng:</strong> Miễn phí vận chuyển cho toàn bộ đơn hàng trong nội thành TP.HCM (áp dụng với đơn từ 300k).</li>
      </ul>
      <h2>Điều kiện áp dụng</h2>
      <p>Chương trình áp dụng từ ngày 01/05/2026 đến hết 31/05/2026. Các ưu đãi này có thể áp dụng đồng thời. Vì mỗi món đồ thủ công đều cần thời gian để chuẩn bị chu đáo, số lượng quà tặng có hạn, bà hãy nhanh tay lựa chọn cho mình món đồ ưng ý nhé!</p>
      <blockquote>Nhắn tin ngay cho fanpage SoulMade để được tư vấn món quà phù hợp nhất với bà hoặc người thân. Tui luôn sẵn lòng lắng nghe và gói ghém những điều tốt đẹp nhất gửi đến bà!</blockquote>
      <h2>Tại sao chọn SoulMade?</h2>
      <p>Tại SoulMade, mỗi món đồ đều được chăm chút kỹ lưỡng, từ khâu chọn nguyên liệu cho đến khi trao tận tay bà. Chúng tui cam kết sản phẩm luôn đúng hình ảnh và mang đậm hơi thở thủ công tinh tế nhất.</p>
    `
  },
  {
    id: 7,
    title: "Quy trình kiểm tra chất lượng đồ gốm thủ công trước khi bày trí",
    excerpt: "Hướng dẫn các bước kiểm tra độ bền, bề mặt men và độ cân bằng của sản phẩm gốm handmade — giúp bà đảm bảo mỗi món đồ trang trí không chỉ đẹp mà còn an toàn và bền vững.",
    category: "Kinh nghiệm",
    date: "28/04/2026",
    author: "SoulMade Care",
    readTime: "8 phút",
    views: "2.1k",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Chất lượng của một món đồ gốm thủ công không chỉ nằm ở vẻ ngoài bắt mắt, mà còn ở độ tinh xảo và bền bỉ. Việc kiểm tra kỹ lưỡng khi mới nhận sản phẩm sẽ giúp bà yên tâm hơn khi để chúng trở thành một phần trong không gian sống của mình.</p>
      <h2>Bước 1: Kiểm tra ngoại quan và chứng từ</h2>
      <p>Mỗi món đồ thủ công từ SoulMade đều có kèm theo hướng dẫn sử dụng và chất liệu. Hãy kiểm tra xem bề mặt có vết rạn nứt lạ hay không. Nếu có bất kỳ vấn đề gì về đóng gói hoặc va đập trong quá trình vận chuyển, hãy liên hệ ngay với tui nhé.</p>
      <h2>Bước 2: Kiểm tra độ cân bằng (Surface Test)</h2>
      <p>Với các sản phẩm như bình hoa hoặc đĩa decor, hãy đặt chúng lên bề mặt phẳng. Một món đồ thủ công chuẩn là khi nó đứng vững, không bị chông chênh. Điều này cho thấy sự chính xác trong kỹ thuật tạo hình của nghệ nhân.</p>
      <h2>Bước 3: Kiểm tra bề mặt men</h2>
      <p>Đưa món đồ ra ánh sáng tự nhiên để quan sát lớp men. Men gốm thủ công có thể có những vệt nhỏ tự nhiên do nung lò, nhưng cần đảm bảo bề mặt mịn, không bị bong tróc hay sắc cạnh gây nguy hiểm khi cầm nắm.</p>
      <blockquote>"Nhiều bà sợ rằng đồ handmade thì sẽ không bền như đồ công nghiệp. Thực tế, nếu được chế tác đúng nhiệt độ và quy trình, đồ gốm thủ công có thể gắn bó với bà hàng chục năm trời." — Nghệ nhân tại SoulMade.</blockquote>
      <h2>Những lỗi cần lưu ý</h2>
      <ul>
        <li><strong>Vết rạn nứt chân chim:</strong> Nếu nằm ở phần thân chịu lực, bà nên liên hệ shop để được hỗ trợ kiểm tra lại.</li>
        <li><strong>Màu men không đồng nhất:</strong> Với đồ thủ công, đây là nét đẹp riêng (độc bản), không phải là lỗi sản xuất.</li>
        <li><strong>Bề mặt sắc cạnh:</strong> Nếu phần đế bị sắc, bà có thể dùng giấy nhám mịn chà nhẹ để tránh làm xước mặt bàn gỗ nhé.</li>
      </ul>
    `
  },
  {
    id: 8,
    title: "Bí quyết bảo quản đồ handmade: Giữ gìn vẻ đẹp bền lâu với thời gian",
    excerpt: "Bảo quản không đúng cách là nguyên nhân hàng đầu khiến đồ decor nhanh cũ, phai màu. Tìm hiểu cách giữ gìn các món đồ handmade luôn như mới với những mẹo nhỏ cực đơn giản.",
    category: "Chăm sóc",
    date: "22/04/2026",
    author: "SoulMade Tips",
    readTime: "6 phút",
    views: "1.5k",
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Món đồ handmade bà yêu thích có đạt được độ bền như mong đợi hay không phụ thuộc rất nhiều vào quá trình bảo quản. Với những món đồ "có hồn" như thế này, một chút nâng niu sẽ giúp chúng luôn giữ được vẻ đẹp ban đầu.</p>
      <h2>Tại sao cần chăm sóc đồ thủ công cẩn thận?</h2>
      <p>Đồ thủ công thường sử dụng nguyên liệu tự nhiên nên rất nhạy cảm với độ ẩm và ánh nắng mặt trời. Nếu để ở nơi quá ẩm, đồ vải dễ bị mốc, còn nếu nắng gắt quá lâu, màu sắc tự nhiên của gốm hay gỗ sẽ dễ bị bạc màu, giòn gãy.</p>
      <h2>Lịch trình chăm sóc định kỳ</h2>
      <ul>
        <li><strong>Vệ sinh nhẹ nhàng:</strong> Đối với đồ trang trí, hãy dùng khăn lông mềm hoặc chổi lông gà phủi bụi 2-3 lần/tuần.</li>
        <li><strong>Tránh ẩm ướt:</strong> Với các món đồ bằng mây, tre, len, tuyệt đối không để ở nơi có độ ẩm cao. Nếu bị ướt, hãy lau khô ngay và để nơi thoáng mát.</li>
        <li><strong>Xoay chuyển vị trí:</strong> Sau vài tháng, hãy thay đổi vị trí các món decor để chúng không bị "nhuộm" nắng ở một phía quá lâu.</li>
      </ul>
      <blockquote>"Đồ thủ công giống như một người bạn, nếu bà đối xử tử tế, nó sẽ gắn bó với bà thật bền lâu." — SoulMade Studio.</blockquote>
      <h2>Sản phẩm hỗ trợ "bảo dưỡng" decor</h2>
      <p>Trong trường hợp các món đồ bằng gỗ cần làm mới, bà có thể dùng một ít dầu oliu hoặc sáp ong chuyên dụng để lau nhẹ, giúp bề mặt gỗ sáng bóng và được bảo vệ tốt hơn khỏi độ ẩm.</p>
      <p>Nếu trong quá trình sử dụng bà thấy món đồ có dấu hiệu cũ đi, hãy nhắn SoulMade nhé, tui sẽ hướng dẫn bà cách phục hồi lại vẻ đẹp cho chúng!</p>
    `
  },
 {
    id: 9,
    title: "So sánh các loại sợi len: Chọn 'người bạn' nào cho tác phẩm handmade đầu tay?",
    excerpt: "Phân tích đặc tính sợi cotton, len acrylic và len hỗn hợp — giúp bà lựa chọn chất liệu phù hợp nhất để sáng tạo nên những món đồ handmade vừa xinh xắn, vừa bền lâu.",
    category: "Nguyên liệu",
    date: "15/04/2026",
    author: "SoulMade Lab",
    readTime: "7 phút",
    views: "2.8k",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Sợi len là "nguyên liệu vàng" trong thế giới handmade. Dù bà là người mới bắt đầu hay đã là "tay chơi" chuyên nghiệp, việc hiểu rõ đặc tính của từng loại sợi sẽ giúp các món đồ của bà trở nên tinh tế và có "hơi thở" riêng.</p>
      <h2>Đặc tính các loại sợi len phổ biến</h2>
      <ul>
        <li><strong>Sợi Cotton:</strong> Mềm mại, thấm hút tốt, không gây kích ứng da. Rất phù hợp cho các sản phẩm như thú bông (amigurumi), áo mùa hè, hoặc khăn tay.</li>
        <li><strong>Len Acrylic:</strong> Độ bền màu cực cao, sợi nhẹ, không bị co rút khi giặt. Lựa chọn lý tưởng cho các món đồ trang trí, thảm hoặc túi xách cần giữ form cứng cáp.</li>
        <li><strong>Len Hỗn hợp (Cotton + Acrylic):</strong> Sự kết hợp hoàn hảo giữa độ mềm mại và độ bền. Đây là loại sợi đa năng nhất, phù hợp cho cả đồ mặc lẫn đồ decor trong nhà.</li>
      </ul>
      <h2>Gợi ý chọn sợi theo từng nhu cầu</h2>
      <ul>
        <li>Sợi Cotton: ~14.500 đ/cuộn 50g</li>
        <li>Len Acrylic: ~14.200 đ/cuộn 50g</li>
        <li>Len Hỗn hợp cao cấp: ~14.300 đ/cuộn 50g</li>
      </ul>
      <blockquote>Liên hệ SoulMade để nhận tư vấn chọn màu và loại sợi phù hợp nhất với dự án của bà. Tui luôn sẵn lòng hỗ trợ bà tìm ra chất liệu "chân ái" cho các tác phẩm của mình.</blockquote>
      <h2>Lời khuyên từ SoulMade</h2>
      <p>Cho những dự án nhỏ xinh như móc khóa hay thú bông, sợi Cotton là lựa chọn tối ưu về độ chi tiết. Nếu bà muốn làm những chiếc giỏ đựng đồ hay thảm lót bàn, đừng ngần ngại chọn Len Acrylic để sản phẩm luôn giữ được form dáng ấn tượng.</p>
    `
  },
  {
    id: 10,
    title: "Tuyệt chiêu xử lý món đồ handmade bị bám bụi và xỉn màu sau thời gian dài",
    excerpt: "Đồ handmade bị bám bụi hay xỉn màu là nỗi lo thường gặp. SoulMade chia sẻ phương pháp làm sạch dịu nhẹ và cách hồi sinh vẻ đẹp nguyên bản cho món đồ yêu quý của bà.",
    category: "Chăm sóc",
    date: "10/04/2026",
    author: "SoulMade Care",
    readTime: "9 phút",
    views: "3.3k",
    image: "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Đồ handmade giống như một người bạn đồng hành, theo thời gian, chúng cũng cần được "tắm rửa" và chăm sóc để giữ mãi nét tươi mới. Với những món đồ decor xinh xắn, việc xử lý đúng cách sẽ giúp chúng bền đẹp đến 10–15 năm.</p>
      <h2>Nguyên nhân khiến đồ handmade bị cũ</h2>
      <ul>
        <li>Bám bụi tích tụ lâu ngày do không gian lưu trữ thiếu thông thoáng.</li>
        <li>Sự thay đổi nhiệt độ và độ ẩm trong phòng làm sợi len hoặc gỗ bị biến đổi.</li>
        <li>Sử dụng sai chất tẩy rửa mạnh làm hỏng bề mặt tự nhiên của món đồ.</li>
        <li>Va chạm gây xước bề mặt hoặc hư hại các chi tiết nhỏ tinh xảo.</li>
      </ul>
      <h2>Quy trình "hồi sinh" món đồ trong 3 bước</h2>
      <p><strong>Bước 1 — Vệ sinh bề mặt:</strong> Sử dụng chổi lông mềm hoặc máy hút bụi cầm tay loại bỏ hoàn toàn lớp bụi bẩn tích tụ.</p>
      <p><strong>Bước 2 — Làm sạch sâu:</strong> Với đồ vải, hãy ngâm nhẹ với nước giặt trung tính trong 10-15 phút, sau đó xả sạch và phơi ở nơi thoáng mát, tránh ánh nắng trực tiếp.</p>
      <p><strong>Bước 3 — Bảo vệ:</strong> Sau khi đồ đã khô hoàn toàn, hãy phủ một lớp sáp ong mỏng (với đồ gỗ) hoặc tinh dầu làm mềm (với đồ da handmade) để bảo vệ bề mặt.</p>
      <blockquote>"Bỏ qua bước làm sạch định kỳ là sai lầm phổ biến khiến món đồ của bà nhanh cũ. Một chút chăm sóc nhẹ nhàng mỗi tháng sẽ giúp vẻ đẹp handmade được duy trì triệt để." — Chuyên gia tại SoulMade.</blockquote>
    `
  },
  {
    id: 11,
    title: "Nhận diện món đồ handmade 'giả' và kém chất lượng: 7 dấu hiệu cần ghi nhớ",
    excerpt: "Đồ handmade kém chất lượng thường len lỏi vào các shop online, làm bà thất vọng khi nhận hàng. Cùng SoulMade điểm qua 7 dấu hiệu nhận biết và 3 mẹo nhỏ để kiểm tra chất lượng đồ thủ công tại nhà.",
    category: "Mẹo nhỏ",
    date: "05/04/2026",
    author: "SoulMade Care",
    readTime: "5 phút",
    views: "4.9k",
    hot: true,
    image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Việc chọn mua đồ handmade là để tìm kiếm sự độc bản và tâm huyết. Thế nhưng, có không ít sản phẩm gắn mác "thủ công" nhưng thực chất là hàng công nghiệp kém chất lượng. Làm sao để chọn được món đồ thực sự xứng đáng với tình yêu của bà?</p>
      <h2>7 dấu hiệu nhận biết món đồ handmade kém chất lượng</h2>
      <ul>
        <li><strong>Đường nét thô vụng:</strong> Các đường may, mũi móc không đều, keo dán bị lem luốc, thiếu sự tỉ mỉ vốn có của đồ thủ công.</li>
        <li><strong>Nguyên liệu "lạ":</strong> Màu sắc không tự nhiên, mùi nhựa hoặc hóa chất nồng nặc – đây là dấu hiệu của nguyên liệu công nghiệp giá rẻ.</li>
        <li><strong>Dễ hư hỏng:</strong> Các chi tiết đính kèm như hạt cườm, nơ hay phụ kiện trang trí dễ bị bong tróc ngay sau vài lần chạm nhẹ.</li>
        <li><strong>Mất form dáng:</strong> Sản phẩm không giữ được hình dáng ban đầu, bị méo mó ngay khi cầm trên tay.</li>
        <li><strong>Thiếu sự kết nối:</strong> Đồ handmade "xịn" thường có sự đồng nhất trong phong cách, hàng kém chất lượng thường "chắp vá" nhiều chi tiết không ăn nhập.</li>
        <li><strong>Đóng gói qua loa:</strong> Một món đồ thủ công tinh tế thường được nâng niu trong lớp bao bì chỉn chu, thay vì bọc nilon sơ sài.</li>
        <li><strong>Giá rẻ bất ngờ:</strong> Nếu giá rẻ hơn 20–30% so với mặt bằng chung, bà nên cân nhắc kỹ vì "tiền nào của nấy" luôn đúng với sản phẩm thủ công.</li>
      </ul>
      <h2>3 cách kiểm tra nhanh tại nhà</h2>
      <p><strong>Test cảm quan:</strong> Hãy chạm nhẹ vào sản phẩm. Một món đồ handmade tốt thường mang lại cảm giác dễ chịu, bề mặt mịn màng, không có các chi tiết sắc nhọn gây nguy hiểm.</p>
      <p><strong>Test độ đàn hồi:</strong> Với các sản phẩm vải hoặc len, hãy thử kéo nhẹ. Nếu vải bị giãn quá mức hoặc không về lại hình dáng ban đầu, chất liệu đó không thực sự bền.</p>
      <p><strong>Tìm hiểu người tạo ra nó:</strong> Hãy xem trang cá nhân hoặc phản hồi của khách hàng cũ. Một nghệ nhân chân chính luôn tự hào kể về quy trình tạo ra món đồ của họ.</p>
      <blockquote>"SoulMade cam kết mỗi sản phẩm gửi đến tay bà đều được tui chăm chút từng mũi kim, sợi chỉ và được kiểm tra kỹ càng để đảm bảo sự chỉn chu nhất." — Team SoulMade.</blockquote>
    `
  },
  {
    id: 12,
    title: "Giải pháp decor thông minh cho căn hộ nhỏ: Tối ưu không gian, thêm tình yêu cho tổ ấm",
    excerpt: "Sống trong không gian nhỏ không có nghĩa là bà phải từ bỏ đam mê decor. Khám phá các giải pháp treo tường, kệ mini và đồ thủ công đa năng giúp căn phòng của bà trở nên thoáng đãng và đậm chất nghệ thuật.",
    category: "Xu hướng",
    date: "01/04/2026",
    author: "SoulMade Studio",
    readTime: "6 phút",
    views: "1.7k",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?q=80&w=1200&auto=format&fit=crop",
    content: `
      <p>Căn hộ nhỏ 3–4m bề ngang thường là nỗi lo của nhiều bà khi muốn trang trí. Nhưng thực ra, chính không gian nhỏ lại là nơi dễ tạo nên sự ấm cúng và tinh tế nhất nếu bà biết cách "tận dụng" mọi góc nhỏ.</p>
      <h2>Sáng tạo với không gian treo tường</h2>
      <p>Thay vì làm chật sàn bằng quá nhiều món đồ decor lớn, hãy đưa chúng lên tường. Các kệ gỗ mini treo tường hay các tác phẩm macramé (thắt dây thủ công) không chỉ giúp tiết kiệm không gian mà còn là điểm nhấn nghệ thuật cực kỳ "chill" cho bức tường trống trải.</p>
      <h2>Đồ handmade đa năng là "cứu cánh"</h2>
      <p>Hãy chọn những món đồ thủ công có nhiều công dụng: ví dụ như một chiếc giỏ cói vừa dùng để đựng len, lại vừa là bình hoa xinh xắn. Hay các móc treo được làm từ gỗ mộc vừa giữ được sự mộc mạc, vừa giúp gọn gàng bàn làm việc.</p>
      <h2>Giải pháp "tối giản hóa"</h2>
      <ul>
        <li><strong>Chọn màu sáng:</strong> Sử dụng đồ decor màu be, kem hoặc pastel để căn phòng có cảm giác rộng hơn.</li>
        <li><strong>Gương nghệ thuật:</strong> Một chiếc gương với viền mây tre đan không chỉ giúp bà soi ngắm mỗi ngày mà còn "nhân đôi" diện tích căn phòng một cách thị giác.</li>
        <li><strong>Đồ decor mảnh mai:</strong> Ưu tiên các loại kệ sắt sơn tĩnh điện mỏng nhẹ thay vì các loại tủ gỗ to lớn, thô kệch.</li>
      </ul>
      <blockquote>"Không gian sống cũng giống như một tác phẩm handmade, mỗi món đồ bà đặt vào đều cần sự chọn lọc kỹ lưỡng. Chỉ cần một vài món đồ tinh tế, căn phòng nhỏ của bà sẽ trở nên đầy cảm hứng hơn bao giờ hết." — KTS. SoulMade Team.</blockquote>
    `
  }
];

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


const NewsDetail = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();

  const [article,       setArticle]      = useState(null);
  const [readProgress,  setReadProgress] = useState(0);
  const [activeHeading, setActiveHead]   = useState(null);
  const [copied,        setCopied]       = useState(false);

  
  useEffect(() => {
    window.scrollTo(0, 0);
    const found = newsData.find(item => item.id === parseInt(id, 10));
    setArticle(found || null);
  }, [id]);


  const { processedHtml, toc } = useMemo(
    () => article?.content ? processContent(article.content) : { processedHtml: '', toc: [] },
    [article]
  );


  const relatedArticles = useMemo(() => {
    if (!article) return [];
    const sameCat = newsData.filter(a => a.id !== article.id && a.category === article.category);
    const others  = newsData.filter(a => a.id !== article.id && a.category !== article.category);
    return [...sameCat, ...others].slice(0, 3);
  }, [article]);


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

      <div
        className="nd-progress-bar"
        style={{ width: `${readProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

    
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


      <div className="nd-breadcrumb-wrap">
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <i className="fas fa-chevron-right" />
          <Link to="/news">Tin tức</Link>
          <i className="fas fa-chevron-right" />
          <span>{article.category}</span>
        </nav>
      </div>

     
      <div className="nd-layout">

        <main className="nd-main">
          <div
            className="nd-content"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />


          <div className="nd-article-footer">

  
            <div className="nd-author-card">
              <div className="nd-author-avatar" aria-hidden="true">
                {article.author.charAt(0).toUpperCase()}
              </div>
              <div className="nd-author-info">
                <h4>{article.author}</h4>
                <span>Biên tập viên · SoulMade</span>
              </div>
            </div>

     
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


        <aside className="nd-sidebar">

      
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


          <div className="nd-cta-widget">
            <div className="nd-cta-icon">📦</div>
            <h4>Cần báo giá nhanh?</h4>
            <p>Đội ngũ tư vấb SiukMade hỗ trợ miễn phí, 7 ngày/tuần từ 7h - 20h.</p>
            <a href="tel:19001234" className="nd-cta-btn">
              <i className="fas fa-phone-alt" /> Gọi ngay
            </a>
          </div>

        </aside>
      </div>


      <div className="nd-back-bar">
        <button className="nd-back-btn" onClick={() => navigate('/news')}>
          <i className="fas fa-arrow-left" /> Trở về danh sách tin tức
        </button>
      </div>

   
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
