-- REVA AI Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard → SQL → New query)

-- ─── Leads ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  phone               TEXT NOT NULL,
  status              TEXT NOT NULL,
  ai_score            INTEGER NOT NULL CHECK (ai_score >= 0 AND ai_score <= 100),
  service_interested  TEXT NOT NULL,
  last_interaction    TEXT NOT NULL,
  recommended_action  TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Reviews ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reviews (
  id                  TEXT PRIMARY KEY,
  customer_name       TEXT NOT NULL,
  rating              INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date                TEXT NOT NULL,
  comment             TEXT NOT NULL,
  sentiment           TEXT NOT NULL,
  risk_level          TEXT NOT NULL,
  ai_suggested_reply  TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Row Level Security (allow anon read for MVP) ────────────────────────────

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on leads" ON leads;
CREATE POLICY "Allow public read on leads"
  ON leads FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public read on reviews" ON reviews;
CREATE POLICY "Allow public read on reviews"
  ON reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow public update on reviews" ON reviews;
CREATE POLICY "Allow public update on reviews"
  ON reviews FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ─── Seed: Leads ─────────────────────────────────────────────────────────────

INSERT INTO leads (id, name, phone, status, ai_score, service_interested, last_interaction, recommended_action)
VALUES
  (
    'LD-001',
    'Nguyễn Thị Mai',
    '0901234567',
    'Đang tư vấn',
    92,
    'Laser trị mụn',
    '15 phút trước',
    'Gọi điện xác nhận lịch hẹn thử nghiệm'
  ),
  (
    'LD-002',
    'Trần Văn Hùng',
    '0912345678',
    'Đã chốt',
    88,
    'Chăm sóc da mặt',
    '1 giờ trước',
    'Gửi tin nhắn cảm ơn + hướng dẫn chuẩn bị trước liệu trình'
  ),
  (
    'LD-003',
    'Lê Thị Hoa',
    '0923456789',
    'Mới',
    74,
    'Triệt lông',
    '3 giờ trước',
    'Gửi video testimonial khách hàng tương tự'
  ),
  (
    'LD-004',
    'Phạm Minh Đức',
    '0934567890',
    'Mất tích',
    31,
    'Massage body',
    '12 ngày trước',
    'Gửi chiến dịch thu hồi lead — voucher 30%'
  ),
  (
    'LD-005',
    'Hoàng Thị Lan',
    '0945678901',
    'Đang tư vấn',
    85,
    'Phun môi collagen',
    '45 phút trước',
    'Gửi album ảnh thực tế + lịch hẹn tư vấn miễn phí'
  ),
  (
    'LD-006',
    'Võ Quốc Bảo',
    '0956789012',
    'Mới',
    67,
    'Detox body',
    '5 giờ trước',
    'Phản hồi tin nhắn Zalo trong 2 giờ'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Seed: Reviews ───────────────────────────────────────────────────────────

INSERT INTO reviews (id, customer_name, rating, date, comment, sentiment, risk_level, ai_suggested_reply)
VALUES
  (
    'RV-001',
    'Trần Thị Hồng',
    5,
    '15/08/2026',
    'Spa rất sạch sẽ, nhân viên thân thiện và chuyên nghiệp. Liệu trình Hydra Facial cho da mình mịn màng hơn hẳn. Chắc chắn sẽ quay lại!',
    'Positive',
    'Low',
    'Chị Hồng thân mến, cảm ơn chị đã dành thời gian chia sẻ đánh giá tích cực! Spa Glow Beauty rất vui khi liệu trình Hydra Facial đã mang lại trải nghiệm tốt cho chị. Hẹn gặp lại chị trong lần tới ạ!'
  ),
  (
    'RV-002',
    'Nguyễn Văn Đạt',
    5,
    '14/08/2026',
    'Lần đầu đến spa, được tư vấn rất kỹ trước khi làm Laser. Kết quả sau 2 buổi đã thấy cải thiện rõ. Giá cả hợp lý so với chất lượng.',
    'Positive',
    'Low',
    'Anh Đạt thân mến, cảm ơn anh đã tin tưởng Spa Glow Beauty! Rất vui khi liệu trình Laser đang cho kết quả tích cực. Nếu anh cần hỗ trợ thêm giữa các buổi, đừng ngần ngại liên hệ team chăm sóc khách hàng của chúng tôi nhé!'
  ),
  (
    'RV-003',
    'Lê Minh Tuấn',
    1,
    '13/08/2026',
    'Đặt lịch 14h mà phải chờ gần 45 phút mới được phục vụ. Nhân viên không xin lỗi, cũng không giải thích lý do. Rất thất vọng vì đã dành thời gian nghỉ trưa đến đây.',
    'Negative',
    'High',
    'Anh Tuấn thân mến, Spa Glow Beauty chân thành xin lỗi vì trải nghiệm chờ đợi không như mong đợi của anh. Đây không phản ánh tiêu chuẩn phục vụ mà chúng tôi cam kết. Chúng tôi đã rà soát lại quy trình đặt lịch và mong được liên hệ trực tiếp qua hotline 1900-xxxx để hỗ trợ anh một buổi chăm sóc bù miễn phí. Rất mong nhận được phản hồi từ anh.'
  ),
  (
    'RV-004',
    'Phạm Thu Trang',
    2,
    '12/08/2026',
    'Kỹ thuật viên làm facial không cẩn thận, da mình bị đỏ và căng khó chịu sau liệu trình. Tư vấn trước khi làm cũng qua loa, không hỏi kỹ về tiền sử dị ứng. Mong spa cải thiện chất lượng dịch vụ.',
    'Negative',
    'High',
    'Chị Trang thân mến, Spa Glow Beauty rất tiếc khi biết chị gặp phản ứng khó chịu sau buổi facial. Sức khỏe làn da của khách hàng luôn là ưu tiên hàng đầu của chúng tôi. Chúng tôi muốn mời chị đến spa để bác sĩ/chuyên viên da liễu kiểm tra miễn phí và điều chỉnh liệu trình phù hợp. Xin vui lòng liên hệ Zalo OA Spa Glow Beauty để chúng tôi hỗ trợ ngay.'
  ),
  (
    'RV-005',
    'Hoàng Thị Lan',
    5,
    '11/08/2026',
    'Không gian thư giãn, nhạc nhẹ, mùi hương dễ chịu. Gói massage body 90 phút rất đáng giá. Nhân viên lễ phép và đúng giờ.',
    'Positive',
    'Low',
    'Chị Lan thân mến, cảm ơn chị đã lựa chọn Spa Glow Beauty! Rất vui khi gói massage body đã giúp chị thư giãn trọn vẹn. Hẹn gặp lại chị sớm nhé!'
  ),
  (
    'RV-006',
    'Võ Quốc Huy',
    4,
    '10/08/2026',
    'Dịch vụ triệt lông khá tốt, giá combo hợp lý. Chỉ tiếc là bãi xe hơi chật vào cuối tuần. Nhìn chung vẫn hài lòng và sẽ giới thiệu bạn bè.',
    'Positive',
    'Low',
    'Anh Huy thân mến, cảm ơn anh đã đánh giá và giới thiệu Spa Glow Beauty! Chúng tôi ghi nhận góp ý về bãi xe và đang trao đổi với ban quản lý tòa nhà để cải thiện. Rất mong được phục vụ anh trong những lần tới!'
  )
ON CONFLICT (id) DO NOTHING;
