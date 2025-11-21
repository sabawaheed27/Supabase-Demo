// utils/uploadImage.ts
import { createClient } from "@/utils/supabase/server-client";

export async function uploadImage(file: File): Promise<string> {
  const supabase = await createClient();
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  
  // Upload to Supabase Storage - CHANGE 'posts' to 'images'
  const { data, error } = await supabase.storage
    .from('images')  
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Return the path (not the full URL)
  return data.path;
}