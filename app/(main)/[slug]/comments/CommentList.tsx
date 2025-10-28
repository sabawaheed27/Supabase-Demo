import { getCommentsForPost } from "@/utils/supabase/queries";
import { CommentWithUser } from "@/utils/supabase/types";
import DeleteCommentButton from "./DeleteCommentButton";


export default async function CommentList({ postId, postSlug }: { postId: number; postSlug: string }) {
  const { data: comments, error } = await getCommentsForPost(postId);

  if (error) {
    return <p className="text-red-500">Failed to load comments.</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="font-bold mb-2">Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((comment: CommentWithUser) => (
            <li key={comment.id} className="border p-3 rounded">
              <p>{comment.content}</p>
              <p className="text-sm text-gray-500">
                by {comment.users?.username || "Unknown user"}
              </p>
              <DeleteCommentButton commentId={comment.id} postSlug={postSlug} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
