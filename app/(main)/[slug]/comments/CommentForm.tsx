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
    setIsSubmitting(true);

    const result = await addComment(postId, postSlug, content);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Comment added!");
      setContent("");
      router.refresh(); //  immediately reloads comments
    } else {
      toast.error(result.error || "Failed to add comment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="border rounded p-2 w-full"
        required/>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400">
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}
