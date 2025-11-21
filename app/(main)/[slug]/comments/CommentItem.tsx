
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { CommentWithUser } from '@/utils/supabase/types';
import { updateComment } from '@/action/update-comment';
import { timeAgo } from '@/utils/formatDate';
import DeleteCommentButton from './DeleteCommentButton';

export default function CommentItem({ comment, user, postSlug, postAuthorId, }: {
  comment: CommentWithUser;
  user: User | null;
  postSlug: string;
  postAuthorId: string; }) 
  {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);

  const isCommentAuthor = user && user.id === comment.users?.id;
  const isPostAuthor = user && user.id === postAuthorId;
  
  // User can delete if they're the comment author OR the post author
  const canDelete = isCommentAuthor || isPostAuthor;
  
  // Only comment author can edit
  const canEdit = isCommentAuthor;

  const handleUpdate = async () => {
    const trimmedContent = content.trim();
    
    if (!trimmedContent) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (trimmedContent === comment.content) {
      setIsEditing(false);
      return;
    }

    if (trimmedContent.length > 1000) {
      toast.error("Comment is too long (max 1000 characters)");
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateComment(comment.id, trimmedContent, postSlug);
      
      if (result.success) {
        toast.success('Comment updated!');
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update comment');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setContent(comment.content);
  };

  return (
    <li className="border p-3 rounded">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border rounded p-2 w-full text-sm"
            rows={3}
            maxLength={1000}
            disabled={isUpdating}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {content.length}/1000
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating || !content.trim()}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <p className="text-gray-800 whitespace-pre-wrap break-words">{comment.content}</p>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <span>by {comment.users?.username || 'Unknown user'}</span>
              {/* Show "Author" badge if commenter is the post author */}
              {comment.users?.id === postAuthorId && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Author
                </span>
              )}
              {comment.created_at && (
                <>
                  <span>•</span>
                  <span>{timeAgo(comment.created_at)}</span>
                </>
              )}
            </div>
          </div>

          {/* Show action buttons if user can edit or delete */}
          {(canEdit || canDelete) && (
            <div className="flex gap-2 shrink-0">
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-500 text-xs font-semibold hover:underline"
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <DeleteCommentButton commentId={comment.id} postSlug={postSlug} />
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}