'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { CommentWithUser } from '@/utils/supabase/types';
import { updateComment } from '@/action/update-comment';
import DeleteCommentButton from './DeleteCommentButton';

export default function CommentItem({comment,user,postSlug,}: {
  comment: CommentWithUser;
  user: User | null;
  postSlug: string;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const isAuthor = user && user.id === comment.users?.id;

  const handleUpdate = async () => {
    const result = await updateComment(comment.id, content, postSlug);
    if (result.success) {
      toast.success('Comment updated!');
      setIsEditing(false);
      router.refresh(); // Refresh to show the updated comment
    } else {
      toast.error(result.error || 'Failed to update comment.');
    }
  };

  return (
    <li className="border p-3 rounded relative group">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border rounded p-2 w-full text-sm"
            rows={3}/>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setContent(comment.content); // Reset content on cancel
              }}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm" >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p>{comment.content}</p>
          <p className="text-sm text-gray-500 mt-1">
            by {comment.users?.username || 'Unknown user'}
          </p>
        </div>
      )}

      {isAuthor && !isEditing && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 text-xs font-semibold">
            Edit
          </button>
          <DeleteCommentButton commentId={comment.id} postSlug={postSlug} />
        </div>
      )}
    </li>
  );
}