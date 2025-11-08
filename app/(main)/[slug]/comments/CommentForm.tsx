'use client';

import { addComment } from "@/action/add-comment";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function CommentForm({ postId, postSlug }: { postId: number; postSlug: string }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
  
    // Validate content
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (trimmedContent.length > 1000) {
      toast.error("Comment is too long (max 1000 characters)");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addComment(postId, postSlug, trimmedContent);

      if (result.success) {
        toast.success("Comment added!");
        setContent("");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to add comment");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Comment submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="border rounded p-2 w-full min-h-[80px] resize-y"
        disabled={isSubmitting}
        maxLength={1000}
        required
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {content.length}/1000
        </span>
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}