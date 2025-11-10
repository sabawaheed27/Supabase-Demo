
"use client";

import createPost from "@/action/create-post";
import { postSchema } from "@/action/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Schema (validation rules)
const clientPostSchema = postSchema.extend({
  image: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files || files.length === 0 || files?.[0]?.size <= 5_000_000,
      `Max file size is 5MB.`
    )
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
      "Image must be .jpg, .png, or .webp and under 5MB"
    ),
});

type FormDataType = z.infer<typeof clientPostSchema>;

const CreatePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [contentLength, setContentLength] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, } = useForm<FormDataType>({
    resolver: zodResolver(clientPostSchema),
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: (result) => {
      if (result?.success) {
        console.log(' Post created successfully!');
        // Show success message
        setShowSuccess(true);
        // Clear form after success
        reset();
        setImagePreview(null);
        setContentLength(0);



        //  CRITICAL: Invalidate React Query cache
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['home-posts'] });
        // Hide success message and redirect after 2 seconds
        setTimeout(() => {
          setShowSuccess(false);
          window.location.href = '/';
          // router.push('/'); // Redirect to home page
        }, 2000);
      } else if (result?.error) {
        // Handle error from server action
        console.error(' Error from server:', result.error);
        toast.error(result.error);
      }
    },
    onError: (error) => {
      console.error(" Mutation error:", error);
      toast.error("Failed to create post. Please try again.");
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      {/* Success Toast Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold">Success!</p>
              <p className="text-sm">Post created successfully </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h2 className="font-bold text-3xl mb-6 text-center text-gray-800">
          Got something to say?
        </h2>

        <form
          onSubmit={handleSubmit((values) => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("content", values.content || "");

            if (values.image && values.image.length > 0) {
              formData.append("image", values.image[0]);
            }

            mutate(formData);
          })}
          className="space-y-6">

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1">
              Post Title
            </label>
            <input
              {...register("title")}
              id="title"
              type="text"
              placeholder="What is your post title?"
              aria-label="Post title"
              aria-invalid={errors.title ? "true" : "false"}
              aria-describedby={errors.title ? "title-error" : undefined}
              disabled={isPending}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {errors.title && (
              <p id="title-error" role="alert" className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image (Optional)
            </label>
            <input
              {...register("image", { onChange: handleImageChange })}
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload image"
              aria-invalid={errors.image ? "true" : "false"}
              aria-describedby={errors.image ? "image-error" : undefined}
              disabled={isPending}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3 disabled:bg-gray-100 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {errors.image && (
              <p id="image-error" role="alert" className="text-red-500 text-sm mt-1">
                {String(errors.image.message)}
              </p>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-64 w-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      const fileInput = document.getElementById('image') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                    aria-label="Remove image preview"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              {...register("content")}
              id="content"
              rows={5}
              maxLength={1000}
              placeholder="Write your post here..."
              aria-label="Post content"
              aria-invalid={errors.content ? "true" : "false"}
              aria-describedby={errors.content ? "content-error" : undefined}
              disabled={isPending}
              onChange={(e) => setContentLength(e.target.value.length)}
              className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              <div>
                {errors.content && (
                  <p id="content-error" role="alert" className="text-red-500 text-sm">
                    {errors.content.message}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {contentLength}/1000 characters
              </p>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 flex items-center justify-center"
            aria-label={isPending ? "Creating post" : "Create post"}
          >
            {isPending ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Post...
              </>
            ) : (
              "Create Post"
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
              <p className="text-red-600 text-center font-medium">
                {error.message || "Failed to create post. Please try again."}
              </p>
            </div>
          )}
        </form>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreatePage;

//PostSchema: the based Zod schema for validating a post (title, content, etc.
//zodResolver → connects Zod with react-hook-form so form inputs are validated automatically.
//useMutation → from React Query, used for sending ("mutating") data to the server (like creating a post).
//z → Zod library, used to define validation rules.