import { getCommentsForPost } from "@/utils/supabase/queries";
import { CommentWithUser } from "@/utils/supabase/types";
import { User } from "@supabase/supabase-js";
import CommentItem from "./CommentItem";


export default async function CommentList({ postId, postSlug, user }: { postId: number; postSlug: string, user: User | null }) {
  const { data: comments, error } = await getCommentsForPost(postId);

  if (error) {
    return <p className="text-red-500">Failed to load comments.</p>;
  }

  return (
    <div>
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((comment: CommentWithUser) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              user={user} 
              postSlug={postSlug} 
            />
          ))}
        </ul>
      )}
    </div>
  );
}
