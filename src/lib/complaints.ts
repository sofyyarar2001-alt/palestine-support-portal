import { supabase } from "@/integrations/supabase/client";
import type { ComplaintStatus } from "@/lib/site";

const BUCKET = "complaint-files";

export type ComplaintFormValues = {
  full_name: string;
  national_id: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  category: string;
  respondent_name: string;
  subject: string;
  details: string;
  amount: string;
};

export type UploadedFile = {
  file_name: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
};

export type TrackResult = {
  found: boolean;
  reference?: string;
  status?: ComplaintStatus;
  category?: string;
  subject?: string;
  created_at?: string;
  updated_at?: string;
  history?: { to_status: ComplaintStatus; created_at: string }[];
};

function randomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function safeName(name: string) {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  return `${randomId()}${ext.toLowerCase()}`;
}

export async function uploadComplaintFile(folder: string, file: File): Promise<UploadedFile> {
  const path = `${folder}/${safeName(file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return {
    file_name: file.name,
    storage_path: path,
    mime_type: file.type || "application/octet-stream",
    size_bytes: file.size,
  };
}

export async function uploadSignature(folder: string, dataUrl: string): Promise<string> {
  const blob = await (await fetch(dataUrl)).blob();
  const path = `${folder}/signature-${randomId()}.png`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: "image/png",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

/** يستدعي الدالة الآمنة submit_complaint، مع بديل محلي إن لم تتوفر. */
export async function submitComplaint(input: {
  values: ComplaintFormValues;
  attachments: UploadedFile[];
  signaturePath: string | null;
}): Promise<{ reference: string; offline: boolean }> {
  const payload = {
    ...input.values,
    amount: input.values.amount || null,
    attachments: input.attachments,
    signature_path: input.signaturePath,
  };

  try {
    const { data, error } = await supabase.rpc("submit_complaint", {
      payload: payload as never,
    });
    if (error) throw error;
    const reference = (data as { reference?: string } | null)?.reference;
    if (!reference) throw new Error("no_reference");
    return { reference, offline: false };
  } catch (error) {
    console.error("submit_complaint failed", error);
    const year = new Date().getFullYear();
    const fallback = `MP-${year}-${randomId().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
    return { reference: fallback, offline: true };
  }
}

export async function trackComplaint(reference: string, last4: string): Promise<TrackResult> {
  const { data, error } = await supabase.rpc("track_complaint", {
    p_reference: reference.trim(),
    p_last4: last4.trim(),
  });
  if (error) throw error;
  return (data ?? { found: false }) as TrackResult;
}

export async function signedFileUrl(path: string, seconds = 300) {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, seconds);
  if (error) throw error;
  return data.signedUrl;
}

export const newComplaintFolder = () => `uploads/${randomId()}`;
