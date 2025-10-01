
import { getHomePosts } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server-client";
 import cashe from "next/cache"
import Link from "next/link";


export const revalidate = 600;


 export default async function Home() {
  const supabase =  await createClient()

  const {data, error} = await getHomePosts(supabase)
//  console.log(data)

  return (
    <div className="w-[80%] mx-auto">
      
        {data && data.map(({id, title, slug, users})=>
        <Link href={`/${slug}`} className="block border-1 rounded mt-4  p-4" key={id}>
          <h2 className="font-bold text-xl">{title}</h2>
          <div className= "text-right">by{users.username}</div>
        </Link>)}
    </div>  
  )
}
 
//getHomePosts() runs on the server → fetches posts from Supabase.
//The data is passed as a prop into <HomePosts />.
//This avoids running a network request on the client at page load,
// so the page is server-side rendered with posts already included