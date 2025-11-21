
'use server';

import { createClient } from "@/utils/supabase/server-client";
import { revalidatePath } from "next/cache";

export async function deleteComment(commentId: number, postSlug: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Get comment with post information to check permissions
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .select(`
        id,
        user_id,
        posts!inner(user_id)
      `)
      .eq('id', commentId)
      .single();

    if (commentError || !comment) {
      return { success: false, error: "Comment not found" };
    }

    // Check if user is either comment author OR post author
    const isCommentAuthor = comment.user_id === user.id;
    const isPostAuthor = comment.posts.user_id === user.id;

    if (!isCommentAuthor && !isPostAuthor) {
      return { 
        success: false, 
        error: "You don't have permission to delete this comment" 
      };
    }

    // Delete the comment
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq("id", commentId);

    if (deleteError) {
      console.error("Error deleting comment:", deleteError);
      return { success: false, error: "Failed to delete comment" };
    }

    revalidatePath(`/${postSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in deleteComment:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}