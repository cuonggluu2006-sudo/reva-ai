import { supabase } from './supabase'
import { reviews as mockReviews } from '../data/reviews'

function mapReviewRow(row) {
  return {
    id: row.id,
    customer_name: row.customer_name,
    rating: row.rating,
    date: row.date,
    comment: row.comment,
    sentiment: row.sentiment,
    risk_level: row.risk_level,
    ai_suggested_reply: row.ai_suggested_reply ?? '',
  }
}

export async function fetchReviews() {
  if (!supabase) {
    return {
      data: mockReviews,
      error: new Error('Supabase chưa được cấu hình — đang dùng dữ liệu mẫu.'),
      fromMock: true,
    }
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(
        'id, customer_name, rating, date, comment, sentiment, risk_level, ai_suggested_reply, created_at',
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[fetchReviews] Supabase error:', error.message)
      return {
        data: mockReviews,
        error: new Error(error.message),
        fromMock: true,
      }
    }

    if (!data?.length) {
      return {
        data: mockReviews,
        error: new Error('Chưa có đánh giá trong cơ sở dữ liệu — đang dùng dữ liệu mẫu.'),
        fromMock: true,
      }
    }

    return {
      data: data.map(mapReviewRow),
      error: null,
      fromMock: false,
    }
  } catch (err) {
    console.error('[fetchReviews] Unexpected error:', err)
    return {
      data: mockReviews,
      error: err instanceof Error ? err : new Error('Không thể tải đánh giá.'),
      fromMock: true,
    }
  }
}

export async function saveReviewReply(id, reply) {
  if (!supabase) {
    return {
      data: null,
      error: new Error('Supabase chưa được cấu hình. Không thể lưu phản hồi.'),
    }
  }

  if (!id?.trim()) {
    return {
      data: null,
      error: new Error('ID đánh giá không hợp lệ.'),
    }
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .update({ ai_suggested_reply: reply })
      .eq('id', id)
      .select('id, ai_suggested_reply')
      .maybeSingle()

    if (error) {
      console.error('[saveReviewReply] Supabase error:', error.message, { id })
      return { data: null, error: new Error(error.message) }
    }

    if (!data) {
      return {
        data: null,
        error: new Error(
          'Không thể lưu phản hồi — không tìm thấy đánh giá hoặc thiếu quyền cập nhật. Hãy chạy policy UPDATE trong Supabase SQL Editor.',
        ),
      }
    }

    return {
      data: { id: data.id, ai_suggested_reply: data.ai_suggested_reply },
      error: null,
    }
  } catch (err) {
    console.error('[saveReviewReply] Unexpected error:', err)
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Không thể lưu phản hồi.'),
    }
  }
}
