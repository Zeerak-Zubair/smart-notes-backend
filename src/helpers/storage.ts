import { supabase, supabaseService } from '../config/supabase';

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

export async function createProfilePicture({
  image_url,
}: {
  image_url: string;
}) {
  return supabaseService.from("profile_pictures").insert({
    image_url
  }).select().single();
}

export async function createProfile({
  name,
  profile_pic_id,
  email,
  user_id,
}: {
  name: string;
  profile_pic_id?: string;
  email: string;
  user_id: string;
}) {
  return supabase.from("profile").insert({
    name,
    profile_pic_id,
    email,
    user_id
  });
}

export async function deleteFile({
  bucket,
  path,
}: {
  bucket: string;
  path: string;
}) {
  const { error } = await supabaseService.storage.from(bucket).remove([path]);
  if (error) {
    throw error;
  }
}

export async function deleteProfilePicture(id: string) {
  return supabaseService.from("profile_pictures").delete().eq("id", id);
}
