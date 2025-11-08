'use client'
import { HomePostType } from "@/utils/supabase/queries";
import { formatDate, timeAgo } from "@/utils/formatDate";
import Link from "next/link";

const HomePosts = ({ posts }: { posts: HomePostType }) => {
  //Temporarily bypass React Query to avoid caching issues
  const data = posts;

  console.log('HomePosts rendering:', data.length, 'posts');

  if (!data || data.length === 0) {
    return (
      <div className="p-8">
        <h2 className="text-2xl">No posts to display</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div>
        <div className="flex flex-row flex-wrap gap-6 justify-center items-center">
          {data.map(({ id, slug, title, users, image_url, created_at }) => (
            <Link
              href={`/${slug}`}
              key={id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-neutral-900/80 border border-neutral-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:scale-105 hover:shadow-blue-950 transition-all"
            >
              {/* Show image if exists, otherwise show placeholder */}
              {image_url ? (
                <img
                  src={image_url}
                  alt={title}
                  className="w-full h-40 object-cover rounded mb-4"
                  onError={(e) => {
                    console.error('Image failed to load:', image_url);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-neutral-800 to-neutral-700 rounded mb-4 flex items-center justify-center">
                  <span className="text-5xl">📝</span>
                </div>
              )}
              
              <h2 className="font-medium text-lg text-blue-100 mb-3 pb-2">
                {title}
              </h2>

              {/* formatted date & time */}
              <p className="text-sm text-gray-500 mb-1 italic">
                {formatDate(created_at)} • {timeAgo(created_at)}
              </p>

              <div className="text-sm text-gray-400 text-right mt-2">
                Posted by{" "}
                <span className="text-gray-400 capitalize">
                  {users?.username || 'Unknown'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePosts;