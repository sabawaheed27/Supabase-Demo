import { getHomePosts } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";
import HomePosts from "@/app/components/Home/HomePosts";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  
  const { data, error } = await getHomePosts(supabase);
  
  if (error) {
    console.error("Error fetching posts:", error);
    return <div className="p-8 text-red-500">Error loading posts: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-[80%] mx-auto p-8">
        <h2 className="text-2xl">No posts yet</h2>
        <p>Be the first to create a post!</p>
      </div>
    );
  }

  // Process posts - handle both full URLs and paths
  const postsWithUrl = await Promise.all(
    data.map(async (post) => {
      if (!post) return null;

      let imageUrl = null;
      
      if (post.image_url) {
        //  Check if it's already a full URL
        if (post.image_url.startsWith('http://') || post.image_url.startsWith('https://')) {
          // It's already a full URL, use it as-is
          imageUrl = post.image_url;
        } else {
          // It's a path, generate the public URL
          imageUrl = supabase.storage.from("posts").getPublicUrl(post.image_url).data.publicUrl;
        }
      }

      return {
        ...post,
        image_url: imageUrl,
      };
    })
  );

  const validPosts = postsWithUrl.filter((post): post is NonNullable<typeof post> => post !== null);

  console.log('Rendering', validPosts.length, 'posts');

  return (
    <div className="w-[80%] mx-auto">
      <HomePosts posts={validPosts} />
    </div>
  );
}