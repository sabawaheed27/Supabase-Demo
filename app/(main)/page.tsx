
import { getHomePosts } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";
// import HomePosts from "../components/Home/HomePosts"; 
import HomePosts from "@/app/components/Home/HomePosts";

export const revalidate = 600;


export default async function Home() {
  const supabase = await createClient()
  
  const { data, error } = await getHomePosts(supabase)
  if(error){
    console.log(error)
  }
  const postsWithUrl = await Promise.all(
    (data || []).map(async (post) => {
      if (!post) return null;
       const imageUrl = post.image_url
        ? supabase.storage.from("posts").getPublicUrl(post.image_url).data.publicUrl
      : null;
          console.log('Post:', post.title, 'Image Path:', post.image_url, 'Public URL:', imageUrl); // Debug log

      return {
        ...post,
        image_url: post.image_url
         
      };
    })
  );
    const validPosts = postsWithUrl.filter((post): post is NonNullable<typeof post> => post !== null);

  return (
    <div className="w-[80%] mx-auto">
      <HomePosts posts={validPosts}/>
    </div>
  )
}

//getHomePosts() runs on the server → fetches posts from Supabase.
//The data is passed as a prop into <HomePosts />.
//This avoids running a network request on the client at page load,
// so the page is server-side rendered with posts already included