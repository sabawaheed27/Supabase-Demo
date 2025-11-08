'use server';

import { createClient } from "@/utils/supabase/server-client";
import { revalidatePath } from "next/cache";

export async function deleteComment(commentId: number, postSlug: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Not authenticated" };
    }

    // Delete comment (RLS will ensure user owns it)
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting comment:", deleteError);
      return { error: "Failed to delete comment" };
    }

    revalidatePath(`/${postSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in deleteComment:", error);
    return { error: "An unexpected error occurred" };
  }
}