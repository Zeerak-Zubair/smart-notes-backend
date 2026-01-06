import { supabase } from '../config/supabase';

export async function uploadImage({
  file,
  bucket,
  userId,
}: {
  file: Express.Multer.File;
  bucket: string;
  folder?: string;
  userId: string;
}) {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return { publicUrl, filePath };
}

export async function createProfile({
  name,
  avatar_url,
  email,
  user_id,
}: {
  name: string;
  avatar_url: string;
  email: string;
  user_id: string;
}) {
  return supabase.from("profile").insert({
    name,
    avatar_url,
    email,
    user_id
  });
}
