'use server'

import { createClient } from '@/utils/supabase/server-client'
import { revalidatePath } from 'next/cache'

export async function updateComment(commentId: number, newContent: string, postSlug: string) {
  if (!newContent.trim()) {
    return { error: 'Comment cannot be empty.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // First confirm we own this comment
  const { data: existingComment, error: findError } = await supabase
    .from('comments')
    .select('id, user_id')
    .eq('id', commentId)
    .single()

  if (findError || !existingComment) {
    return { error: 'Comment not found.' }
  }

  console.log('updateComment user:', user.id, 'commentId:', commentId)
  console.log(' Found comment:', existingComment)

  // Update comment
  const { data, error } = await supabase
    .from('comments')
    .update({ content: newContent })
    .eq('id', commentId)
    .eq('user_id', user.id)
    .select('id, content')
    .maybeSingle()

  if (error) {
    // console.error('Error updating comment:', error)
    return { error: 'Failed to update comment' }
  }

  if (!data) {
    // console.log(' No rows returned after update — likely RLS issue')
    return { error: "You don't have permission to edit this comment." }
  }

  revalidatePath(`/${postSlug}`)
  return { success: true }
}
