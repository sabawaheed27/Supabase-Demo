'use server';

import { createClient } from "@/utils/supabase/server-client";
import { revalidatePath } from "next/cache";

export async function addComment(postId: number, postSlug: string,   content: string) {
  try {
    // Validate input
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return { error: "Comment cannot be empty" };
    }

    if (trimmedContent.length > 1000) {
      return { error: "Comment is too long (max 1000 characters)" };
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Verify post exists
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return { error: "Post not found" };
    }

    // Insert comment
    const { error: insertError } = await supabase
      .from("comments")
      .insert([{ 
        post_id: postId, 
        user_id: user.id, 
        content: trimmedContent 
      }]);

    if (insertError) {
      console.error("Error inserting comment:", insertError);
      return { error: "Failed to add comment" };
    }

    revalidatePath(`/${postSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in addComment:", error);
    return { error: "An unexpected error occurred" };
  }
}
