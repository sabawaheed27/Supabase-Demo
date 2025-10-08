
"use client";

import createPost from "@/action/create-post";
import { postSchema } from "@/action/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  const { register, handleSubmit, formState: { errors } } = useForm<FormDataType>({
    resolver: zodResolver(clientPostSchema),
  });

  const { mutate, error } = useMutation({
    mutationFn: createPost,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
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
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3" />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              {...register("image")}
              id="image"
              type="file"
              accept="image/*"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3" />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{String(errors.image.message)}</p>
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
              rows={4}
              placeholder="Write your post here..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3" />
            {errors.content && <p className="text-red-500">{errors.content.message}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200">
            Create Post
          </button>

          {error && (
            <p className="text-red-500 text-center">{error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePage;


//PostSchema: the based Zod schema for validating a post (title, content, etc.
//zodResolver → connects Zod with react-hook-form so form inputs are validated automatically.
//useMutation → from React Query, used for sending ("mutating") data to the server (like creating a post).
//z → Zod library, used to define validation rules.
