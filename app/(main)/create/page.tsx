"use client";

import CreatePost from "@/action/create-post";
import { postSchema } from "@/action/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const CreatePage = () => {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(postSchema),
  });

const {mutate, error}=useMutation({
    mutationFn: CreatePost
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h2 className="font-bold text-3xl mb-6 text-center text-gray-800">
          Got something to say?
        </h2>

        <form onSubmit={handleSubmit(values => mutate(values))} className="space-y-6">
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
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3"/>
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
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-3"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
