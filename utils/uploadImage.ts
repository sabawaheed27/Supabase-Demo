
import { v4 as uuidv4 } from "uuid";
import { createClient } from "./supabase/server-client";
import { slugify } from "./slugify";

export async function uploadImage(file: File): Promise<string> {
  const supabase = await createClient();
  const fileParts = file.name.split(".");
  const fileExtension = fileParts.length > 1 ? fileParts.pop() : "";
  const baseFileName = fileParts.join(".");

  // It's good practice to handle cases where there might not be an extension.
  const cleanFileName = slugify(baseFileName);
  const fileName = `${uuidv4()}-${cleanFileName}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, file);

  if (error) {
    // Log the full error object for more details
    console.error("Error uploading image to Supabase:", error);
    throw new Error("Failed to upload image.");
  }

  // console.log("Image uploaded successfully:", data);

  const { data: publicUrlData } = supabase.storage
    .from("images")
    .getPublicUrl(fileName);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Could not get public URL for the image.");
  }

  return publicUrlData.publicUrl;
}
