import { createClient } from "./browser-client"
//createClient → a helper function that creates a Supabase client for making API calls.
import { type QueryData } from "@supabase/supabase-js"


export const getHomePosts = async (supabase: ReturnType<typeof createClient>) => {
    return await supabase
        .from('posts')
        .select('id, title, slug, image_url, users("username")')
        .order('created_at', { ascending: false })
}

export const getSinglePost = async (slug: string) => {
    const supabase = createClient()
    // return await supabase
    const { data, error } = await supabase
        .from('posts')
         .select('id, title, content, slug, image_url, user_id, users("username")')
        .eq('slug', slug)
        .single()
        
  return { data, error };
}

export const getSearchedPosts = async (searchTerm: string) => {
    const supabase = createClient()

    return (await supabase
        .from('posts')
        .select('id,title, slug')
        .ilike('title', `%${searchTerm}%`)
    )

}

export type HomePostType = QueryData<ReturnType<typeof getHomePosts>>



//ReturnType<typeof getHomePosts> → infers the return type of the getHomePosts function.
//QueryData<...> → extracts the array of post objects from the Supabase query result.
//This ensures HomePosts has proper TypeScript typing and you get auto-complete for id, title, slug, users.username.


//You have a set of functions that handle data fetching from Supabase:
//These functions are the data layer. They are reusable across server components, API routes, or client components.