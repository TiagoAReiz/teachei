import { supabase } from "@/ap/shared/db/supabase";

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function uploadBase64Image(
  bucket: string,
  path: string,
  base64DataUrl: string
): Promise<string> {
  const match = base64DataUrl.match(/^data:([^;]+);base64,([\s\S]+)$/);
  if (!match) throw new Error("Formato de imagem inválido");
  const [, mimeType, data] = match;
  const ext = MIME_TO_EXT[mimeType] ?? "jpg";
  const buffer = Buffer.from(data, "base64");
  const fullPath = `${path}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(fullPath, buffer, {
    contentType: mimeType,
    upsert: true,
  });
  if (error) throw new Error(`Erro ao salvar imagem: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fullPath);
  return publicUrl;
}

export async function deleteStorageImage(bucket: string, publicUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  await supabase.storage.from(bucket).remove([decodeURIComponent(path)]);
}
