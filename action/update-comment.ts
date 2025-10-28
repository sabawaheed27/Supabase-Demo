'use server';

import { createClient } from "@/utils/supabase/server-client";
import { revalidatePath } from "next/cache";

export async function updateComment(commentId: number, postSlug: string, newContent: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("comments")
    .update({ content: newContent })
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating comment:", error);
    return { error: "Failed to update comment" };
  }

  revalidatePath(`/${postSlug}`);
  return { success: true };
}
