import { supabase } from './supabase'
import { leads as mockLeads } from '../data/leads'
import { normalizeLead } from './leadUtils'

export async function fetchLeads() {
  if (!supabase) {
    return {
      data: mockLeads.map((mock) => normalizeLead(mock, mock)),
      error: new Error('Supabase chưa được cấu hình — đang dùng dữ liệu mẫu.'),
      fromMock: true,
    }
  }

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[fetchLeads] Supabase error:', error.message)
      return {
        data: mockLeads.map((mock) => normalizeLead(mock, mock)),
        error: new Error(error.message),
        fromMock: true,
      }
    }

    if (!data?.length) {
      return {
        data: mockLeads.map((mock) => normalizeLead(mock, mock)),
        error: new Error('Chưa có leads trong cơ sở dữ liệu — đang dùng dữ liệu mẫu.'),
        fromMock: true,
      }
    }

    return {
      data: data.map((row) => {
        const mock = mockLeads.find(
          (m) => m.id === row.id || m.phone === row.phone,
        )
        return normalizeLead(row, mock)
      }),
      error: null,
      fromMock: false,
    }
  } catch (err) {
    console.error('[fetchLeads] Unexpected error:', err)
    return {
      data: mockLeads.map((mock) => normalizeLead(mock, mock)),
      error: err instanceof Error ? err : new Error('Không thể tải leads.'),
      fromMock: true,
    }
  }
}

export async function saveLeadFollowUp(id, suggestedFollowup) {
  if (!supabase) {
    return {
      data: null,
      error: new Error('Supabase chưa được cấu hình. Không thể lưu tin nhắn.'),
    }
  }

  if (!id?.trim()) {
    return { data: null, error: new Error('ID lead không hợp lệ.') }
  }

  try {
    const payload = {
      suggested_followup: suggestedFollowup,
      recommended_action: suggestedFollowup,
      status: 'contacted',
    }

    const { data, error } = await supabase
      .from('leads')
      .update(payload)
      .eq('id', id)
      .select('id, suggested_followup, recommended_action, status')
      .maybeSingle()

    if (error) {
      console.error('[saveLeadFollowUp] Supabase error:', error.message, { id })
      return { data: null, error: new Error(error.message) }
    }

    if (!data) {
      return {
        data: null,
        error: new Error(
          'Không thể lưu — không tìm thấy lead hoặc thiếu quyền cập nhật. Chạy migration leads_ai_scoring.sql trong Supabase.',
        ),
      }
    }

    return { data, error: null }
  } catch (err) {
    console.error('[saveLeadFollowUp] Unexpected error:', err)
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Không thể lưu tin nhắn.'),
    }
  }
}
