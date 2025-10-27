'use server';

import { createClient } from "@/utils/supabase/server-client";
import { revalidatePath } from 'next/cache';


export async function editPost(postId: number, updates: { title: string; content: string; image_url?: string; slug: string }) {
//  console.log(" editPost called with:", { postId, updates });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()
   console.log(" User:", user);
  try {


    const supabase = await createClient();

    await supabase
      .from("posts")
       .update(updates)
      .eq("id", postId)
      .throwOnError();
    
 console.log("Post updated successfully in Supabase.");

    revalidatePath('/');
    revalidatePath(`/${updates.slug}`); // Revalidate using the new slug

    return { success: true };
  } catch (error) {
    // console.error("Error updating post:", error);
    // Optionally, return an error object to the client
    return { error: "Failed to update the post." };
  }
}; 
