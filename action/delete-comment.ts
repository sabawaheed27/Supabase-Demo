'use server';

import { createClient } from "@/utils/supabase/server-client";
import { revalidatePath } from "next/cache";

export async function deleteComment(commentId: number, postSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error, count } = await supabase
    .from('comments')
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id) // Only allow comment owner to delete
    .select() // Ask Supabase to return the number of deleted rows
    .single(); // We expect to delete one row


  if (error) {
    console.error("Error deleting comment:", error);
    return { error: "Failed to delete comment" };
  }

  if (count === 0) {
    return { error: "Comment not found or you don't have permission to delete it." };
  }

  revalidatePath(`/${postSlug}`);
  return { success: true };
}
