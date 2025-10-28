import { type QueryData } from "@supabase/supabase-js";
import { getCommentsForPost, getHomePosts } from "./queries";

export type CommentWithUser = QueryData<
  ReturnType<typeof getCommentsForPost>
>[number];
export type HomePostType = QueryData<ReturnType<typeof getHomePosts>>;