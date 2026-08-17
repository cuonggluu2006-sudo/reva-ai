import { GoogleGenerativeAI } from '@google/generative-ai'

const BRAND_NAME = 'Spa Glow Beauty'

const MODEL_PRIORITY = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash',
]

function getApiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY?.trim() ?? ''
}

function extractErrorDetail(error) {
  if (!error) return 'Unknown error'
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (typeof error === 'object') {
    if ('message' in error && error.message) return String(error.message)
    if ('error' in error && error.error?.message) return String(error.error.message)
    try {
      return JSON.stringify(error)
    } catch {
      return String(error)
    }
  }
  return String(error)
}

function isModelNotFoundError(error) {
  const detail = extractErrorDetail(error).toLowerCase()
  return (
    detail.includes('404') ||
    detail.includes('not found') ||
    detail.includes('is not supported')
  )
}

function getHonorific(name) {
  const parts = name?.trim().split(/\s+/) ?? []
  return parts.length ? parts[parts.length - 1] : 'Quý khách'
}

async function generateViaSdk(modelName, prompt, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: modelName })
  const result = await model.generateContent(prompt)
  const text = result.response.text()?.trim()
  if (!text) throw new Error('Empty response from SDK')
  return text
}

async function generateViaRest(modelName, prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.error?.message ?? `HTTP ${response.status}`)
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!text) throw new Error('Empty response from REST API')
  return text
}

async function tryModel(modelName, prompt, apiKey) {
  try {
    return await generateViaSdk(modelName, prompt, apiKey)
  } catch (sdkError) {
    console.warn(`[AI] SDK ${modelName}:`, extractErrorDetail(sdkError))

    if (!isModelNotFoundError(sdkError)) {
      throw sdkError
    }

    try {
      return await generateViaRest(modelName, prompt, apiKey)
    } catch (restError) {
      console.warn(`[AI] REST ${modelName}:`, extractErrorDetail(restError))
      throw restError
    }
  }
}

function generateBackupReply(reviewText, sentiment, customerName) {
  const honorific = getHonorific(customerName)
  const snippet = reviewText?.slice(0, 60) ?? 'phản hồi của Quý khách'

  if (sentiment === 'Negative') {
    const isWait = /chờ|wait|lâu/i.test(reviewText)
    const isService = /dịch vụ|facial|kỹ thuật|da|đỏ/i.test(reviewText)

    if (isWait) {
      return `${honorific} thân mến, ${BRAND_NAME} chân thành xin lỗi vì thời gian chờ đợi không như mong đợi. Chúng tôi đang rà soát quy trình đặt lịch và mong được hỗ trợ ${honorific} một buổi chăm sóc bù miễn phí. Rất mong nhận được phản hồi từ ${honorific}.`
    }
    if (isService) {
      return `${honorific} thân mến, ${BRAND_NAME} rất tiếc khi biết trải nghiệm dịch vụ chưa đạt kỳ vọng. Sức khỏe làn da của khách hàng là ưu tiên hàng đầu — chúng tôi muốn mời ${honorific} kiểm tra miễn phí và điều chỉnh liệu trình phù hợp. Xin vui lòng liên hệ Zalo OA để được hỗ trợ ngay.`
    }

    return `${honorific} thân mến, ${BRAND_NAME} chân thành cảm ơn và xin lỗi vì trải nghiệm liên quan đến "${snippet}". Team quản lý đã ghi nhận và cam kết cải thiện. Rất mong được liên hệ trực tiếp để hỗ trợ ${honorific} tận tâm nhất.`
  }

  if (sentiment === 'Neutral') {
    return `${honorific} thân mến, ${BRAND_NAME} trân trọng cảm ơn phản hồi về "${snippet}". Chúng tôi ghi nhận góp ý và đang tối ưu quy trình phục vụ. Rất mong được đón ${honorific} trở lại để mang đến trải nghiệm trọn vẹn hơn.`
  }

  return `${honorific} thân mến, ${BRAND_NAME} xin chân thành cảm ơn vì đã tin tưởng và chia sẻ phản hồi tích cực. Niềm vui của ${honorific} là động lực lớn nhất để team không ngừng nâng cao chất lượng. Hân hạnh được phục vụ ${honorific} trong những lần tới!`
}

function generateBackupFollowUp({
  name,
  service_interest,
  last_interaction,
  last_objection,
  score,
}) {
  const honorific = getHonorific(name)
  const service = service_interest || 'dịch vụ spa'
  const objection = last_objection || 'một số thắc mắc'
  const interaction = last_interaction || 'gần đây'

  if (score >= 80) {
    return `Chào ${honorific}! ${BRAND_NAME} rất vui vì ${honorific} quan tâm ${service} (${interaction}). Em hiểu ${honorific} đang cân nhắc về ${objection.toLowerCase()}. Hiện spa có ưu đãi giảm 15% khi đặt cọc trong 48h — em xin phép gửi lịch trống tuần này để ${honorific} tiện sắp xếp ạ?`
  }

  if (score >= 50) {
    return `Chào ${honorific}! Cảm ơn ${honorific} đã quan tâm ${service} tại ${BRAND_NAME}. Em ghi nhận ${honorific} còn băn khoăn về ${objection.toLowerCase()}. Spa sẵn sàng tư vấn miễn phí 15 phút và gửi case study khách hàng tương tự — ${honorific} có thể cho em xin khung giờ thuận tiện không ạ?`
  }

  return `Chào ${honorific}! ${BRAND_NAME} nhớ ${honorific} từng hỏi về ${service}. Em xin gửi voucher giảm 20% (hạn 7 ngày) để ${honorific} trải nghiệm khi thuận tiện — không ràng buộc đặt lịch. Nếu cần tư vấn thêm về ${objection.toLowerCase()}, em luôn sẵn sàng hỗ trợ ạ!`
}

async function generateText(prompt, backupGenerator) {
  const apiKey = getApiKey()

  if (!apiKey) {
    console.warn('[AI] Missing API key — using Backup AI Engine')
    return { text: backupGenerator(), usedBackup: true }
  }

  for (const modelName of MODEL_PRIORITY) {
    try {
      const text = await tryModel(modelName, prompt, apiKey)
      console.info(`[AI] Success via ${modelName}`)
      return { text, usedBackup: false }
    } catch (error) {
      if (!isModelNotFoundError(error)) {
        console.warn(`[AI] Non-404 error on ${modelName}, trying next model`)
      }
    }
  }

  console.warn('[AI] All Gemini models unavailable — using Backup AI Engine')
  return { text: backupGenerator(), usedBackup: true }
}

export async function generateReply(reviewText, sentiment, customerName = '') {
  const prompt = `Bạn là Quản lý Chăm sóc Khách hàng cao cấp của spa "${BRAND_NAME}" tại Việt Nam.

Nhiệm vụ: Viết phản hồi Google Review bằng tiếng Việt cho khách hàng.

Yêu cầu:
- Giọng điệu lịch sự, đồng cảm, chuyên nghiệp như spa cao cấp
- Tối đa 3 câu, ngắn gọn
- Nếu đánh giá tiêu cực: xin lỗi chân thành trước, đề xuất giải pháp cụ thể
- Nếu đánh giá tích cực: cảm ơn chân thành, mời quay lại
- Không dùng emoji, không dùng dấu ngoặc giải thích
- Chỉ trả về nội dung phản hồi, không tiêu đề

Sentiment: ${sentiment}
Nội dung review:
"${reviewText}"`

  return generateText(prompt, () =>
    generateBackupReply(reviewText, sentiment, customerName),
  )
}

export async function generateFollowUp({
  name,
  service_interest,
  last_interaction,
  last_objection,
  score,
}) {
  const prompt = `Bạn là chuyên viên chăm sóc khách hàng của spa cao cấp "${BRAND_NAME}" tại Việt Nam.

Nhiệm vụ: Soạn tin nhắn Zalo/SMS follow-up bằng tiếng Việt để khuyến khích khách đặt lịch hẹn.

Thông tin lead:
- Tên khách: ${name || 'Quý khách'}
- Dịch vụ quan tâm: ${service_interest || 'Chưa rõ'}
- Tương tác gần nhất: ${last_interaction || 'Chưa có'}
- Rào cản / objection: ${last_objection || 'Chưa rõ'}
- AI Lead Score: ${score ?? 0}/100

Yêu cầu:
- Cá nhân hóa theo thông tin trên, xưng "em" và gọi tên khách
- Giọng thân thiện, tinh tế, không ép buộc
- Gợi ý đặt lịch một cách nhẹ nhàng (có thể nhắc ưu đãi nhỏ nếu score cao)
- Phù hợp gửi qua Zalo hoặc SMS, khoảng 3-5 câu
- Không dùng emoji
- Chỉ trả về nội dung tin nhắn, không tiêu đề hay ghi chú`

  return generateText(prompt, () =>
    generateBackupFollowUp({
      name,
      service_interest,
      last_interaction,
      last_objection,
      score,
    }),
  )
}
