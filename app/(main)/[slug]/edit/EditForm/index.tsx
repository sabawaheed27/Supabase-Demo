'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editPost } from "@/action/edit-post";
import type { QueryData } from "@supabase/supabase-js";
import { getSinglePost } from "@/utils/supabase/queries";
import { toast } from "sonner";
import { generateSlug } from "@/utils/generate-slug";


export type Post = QueryData<ReturnType<typeof getSinglePost>>;

const EditForm = ({ post }: { post: Post }) => {

  const router = useRouter();
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");
  const [imageUrl, setImageUrl] = useState(post.image_url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newSlug = generateSlug(title);
  console.log("Calling editPost now…");
     const result = await editPost(post.id, { title, content, image_url: imageUrl, slug: newSlug });
      //  console.log("Result from server:", result);

    setIsSubmitting(false);

    if (result?.success) {
      toast.success("Post updated successfully!");
      // Navigate to the new post URL. The server action should handle revalidation,
      // so Next.js will fetch fresh data for the new page.
        router.refresh();
      router.push(`/${newSlug}`);
    } else if (result?.error) {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border rounded p-2"
        required/>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        className="border rounded p-2 h-40"
        required/>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="border rounded p-2"/>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400">
        {isSubmitting ? "Saving..." : "Save Changes"}
       
      </button>
    </form>
  );
};

export default EditForm;



