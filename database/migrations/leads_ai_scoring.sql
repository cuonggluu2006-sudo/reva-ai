-- REVA AI: Leads AI Scoring migration
-- Run in Supabase SQL Editor after the base schema

ALTER TABLE leads ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score_reason TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_objection TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS service_interest TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS suggested_followup TEXT;

-- Backfill from legacy columns
UPDATE leads SET
  score = COALESCE(score, ai_score),
  service_interest = COALESCE(service_interest, service_interested),
  suggested_followup = COALESCE(suggested_followup, recommended_action),
  score_reason = COALESCE(score_reason, 'Điểm AI dựa trên mức độ tương tác gần đây'),
  last_objection = COALESCE(last_objection, 'Chưa xác định rõ')
WHERE score IS NULL
   OR service_interest IS NULL
   OR score_reason IS NULL
   OR last_objection IS NULL;

-- Map Vietnamese status labels to canonical keys (safe to re-run)
UPDATE leads SET status = CASE status
  WHEN 'Mới' THEN 'new'
  WHEN 'Đang tư vấn' THEN 'contacted'
  WHEN 'Đã chốt' THEN 'won'
  WHEN 'Mất tích' THEN 'lost'
  ELSE status
END
WHERE status IN ('Mới', 'Đang tư vấn', 'Đã chốt', 'Mất tích');

-- RLS: allow UPDATE for MVP
DROP POLICY IF EXISTS "Allow public update on leads" ON leads;
CREATE POLICY "Allow public update on leads"
  ON leads FOR UPDATE
  USING (true)
  WITH CHECK (true);
