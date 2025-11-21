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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(post.image_url || null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setRemoveImage(false);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    
    // Clear file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newSlug = generateSlug(title);
    
    // Create FormData to handle file upload
    const formData = new FormData();
    formData.append('postId', post.id.toString());
    formData.append('title', title);
    formData.append('content', content);
    formData.append('slug', newSlug);
    formData.append('removeImage', removeImage.toString());
    
    // Add old image URL so we can delete it if needed
    if (post.image_url) {
      formData.append('oldImageUrl', post.image_url);
    }
    
    // Add new image file if selected
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const result = await editPost(formData);
    setIsSubmitting(false);

    if (result?.success) {
      toast.success("Post updated successfully!");
      router.refresh();
      router.push(`/${newSlug}`);
    } else if (result?.error) {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border rounded-lg p-3 focus:border-blue-500 focus:ring focus:ring-blue-200"
          required
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full border rounded-lg p-3 h-40 focus:border-blue-500 focus:ring focus:ring-blue-200"
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Upload New Image (Optional)
        </label>
        <input
          type="file"
          id="image"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3 disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        
        {/* Image Preview */}
        {imagePreview && !removeImage && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              {imageFile ? 'New Image Preview:' : 'Current Image:'}
            </p>
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 w-full object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {removeImage && (
          <p className="text-sm text-gray-500 mt-2">Image will be removed when you save</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditForm;