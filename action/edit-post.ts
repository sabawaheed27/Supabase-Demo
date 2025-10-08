'use server';

import { createClient } from "@/utils/supabase/server-client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const editPost = async (
  postId: number,
  updates: { title: string; content: string; image_url?: string }) => {
  try {
    const supabase = await createClient();
    
    await supabase
      .from("posts")
      .update(updates)
      .eq("id", postId)
      .throwOnError();
  
    revalidatePath(`/`);
    redirect(`/`);
  } catch (error) {
    console.error("Error updating post:", error);
    // Optionally, return an error object to the client
    return { error: "Failed to update the post." };
  }
}; 
