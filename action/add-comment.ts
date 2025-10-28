'use server';

import { createClient } from "@/utils/supabase/server-client";
import { revalidatePath } from "next/cache";

export async function addComment(postId: number, postSlug: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("comments")
    .insert([{ post_id: postId, user_id: user.id, content }]);

  if (error) return { error: "Failed to add comment" };

  revalidatePath(`/${postSlug}`);
  return { success: true };
}
