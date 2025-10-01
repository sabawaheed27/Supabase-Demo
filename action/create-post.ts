
'use server'

import { createClient } from "@/utils/supabase/server-client"
import { postSchema } from "./schema"
import z from "zod"
import { redirect } from "next/navigation"
import { slugify } from "@/utils/slugify"
import { revalidatePath } from "next/cache"


const CreatePost = async (userdata: z.infer<typeof postSchema>) => {
    const parsedData = postSchema.parse(userdata)
    const slug = slugify(parsedData.title)

    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser()
    if (!user) throw new Error("User not found")

    const userId = user.id;

    await supabase.from('posts')
        .insert([{ user_id: userId, slug, ...parsedData }])
        .throwOnError()

    revalidatePath('/')
    redirect(`/${slug}`)
}



export default CreatePost