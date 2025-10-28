'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { deleteComment } from '@/action/delete-comment';
import { useRouter } from 'next/navigation';

export default function DeleteCommentButton({ commentId, postSlug }: { commentId: number; postSlug: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    startTransition(async () => {
      const result = await deleteComment(commentId, postSlug);
      if (result.success) {
        toast.success('Comment deleted!');
        // router.refresh() is not strictly needed here because revalidatePath
        // in the action handles it, but it can make the UI feel faster.
      } else {
        toast.error(result.error || 'Failed to delete comment');
      }
    });
  };

  return <button onClick={handleClick} disabled={isPending} className="text-red-500 text-sm mt-1 disabled:text-gray-400">Delete</button>;
}
