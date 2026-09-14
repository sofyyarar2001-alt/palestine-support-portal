import { supabase } from "@/integrations/supabase/client";
import type { ComplaintStatus } from "@/lib/site";

export type ComplaintRow = {
  id: string;
  reference: string;
  full_name: string;
  national_id: string;
  phone: string;
  email: string | null;
  city: string | null;
  address: string | null;
  category: string;
  respondent_name: string | null;
  subject: string;
  details: string;
  amount: number | null;
  status: ComplaintStatus;
  created_at: string;
  updated_at: string;
};

export async function fetchComplaints(options?: {
  status?: ComplaintStatus | "all";
  search?: string;
  limit?: number;
}) {
  let query = supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(options?.limit ?? 200);

  if (options?.status && options.status !== "all") query = query.eq("status", options.status);

  const search = options?.search?.trim();
  if (search) {
    const term = `%${search}%`;
    query = query.or(
      `reference.ilike.${term},full_name.ilike.${term},phone.ilike.${term},subject.ilike.${term},national_id.ilike.${term}`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ComplaintRow[];
}

export async function fetchComplaint(id: string) {
  const { data, error } = await supabase.from("complaints").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data ?? null) as ComplaintRow | null;
}

export async function fetchComplaintExtras(id: string) {
  const [attachments, signatures, notes, history] = await Promise.all([
    supabase.from("attachments").select("*").eq("complaint_id", id).order("created_at"),
    supabase.from("signatures").select("*").eq("complaint_id", id).order("created_at"),
    supabase.from("admin_notes").select("*").eq("complaint_id", id).order("created_at", { ascending: false }),
    supabase.from("status_history").select("*").eq("complaint_id", id).order("created_at"),
  ]);

  return {
    attachments: attachments.data ?? [],
    signatures: signatures.data ?? [],
    notes: notes.data ?? [],
    history: history.data ?? [],
  };
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus) {
  const { error } = await supabase.from("complaints").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function addAdminNote(complaintId: string, note: string, authorEmail: string) {
  const { error } = await supabase
    .from("admin_notes")
    .insert({ complaint_id: complaintId, note, author_email: authorEmail });
  if (error) throw error;
}

export async function fetchStats() {
  const rows = await fetchComplaints({ limit: 1000 });
  const counts: Record<string, number> = {
    total: rows.length,
    new: 0,
    in_review: 0,
    needs_info: 0,
    processed: 0,
    closed: 0,
  };
  for (const row of rows) counts[row.status] = (counts[row.status] ?? 0) + 1;
  return { counts, recent: rows.slice(0, 8) };
}
