'use client';

import { useState } from "react";
import { editPost } from "@/action/edit-post";
import type { QueryData } from "@supabase/supabase-js";
import { getSinglePost } from "@/utils/supabase/queries";


export type Post = QueryData<ReturnType<typeof getSinglePost>>;

const EditForm = ({ post }: { post: Post }) => {
  const [title, setTitle] = useState(post.title || "");
  const [content, setContent] = useState(post.content || "");
  const [imageUrl, setImageUrl] = useState(post.image_url || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editPost(post.id, { title, content, image_url: imageUrl });
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
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Save Changes
      </button>
    </form>
  );
};

export default EditForm;
