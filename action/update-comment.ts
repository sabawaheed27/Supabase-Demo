'use server';

import { createClient } from '@/utils/supabase/server-client';
import { revalidatePath } from 'next/cache';

export async function updateComment(commentId: number, newContent: string, postSlug: string) {
  try {
    // Validate input
    const trimmedContent = newContent.trim();
    if (!trimmedContent) {
      return { error: 'Comment cannot be empty' };
    }

    if (trimmedContent.length > 1000) {
      return { error: 'Comment is too long (max 1000 characters)' };
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: 'Not authenticated' };
    }

    // Update comment (RLS will ensure user owns it)
    const { data, error: updateError } = await supabase
      .from('comments')
      .update({ 
        content: trimmedContent
      })
      .eq('id', commentId)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle();

    if (updateError) {
      console.error('Error updating comment:', updateError);
      return { error: 'Failed to update comment' };
    }

    if (!data) {
      return { error: "Comment not found or you don't have permission to edit it" };
    }

    revalidatePath(`/${postSlug}`);
    return { success: true };
  } catch (error) {
    console.error('Unexpected error in updateComment:', error);
    return { error: 'An unexpected error occurred' };
  }
}