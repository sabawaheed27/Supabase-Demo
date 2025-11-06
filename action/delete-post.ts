   
'use server'

import { createClient } from "@/utils/supabase/server-client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const DeletePost = async (postId: number) => {
    try {
        const supabase = await createClient()
        
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)

        if (error) {
            throw new Error(error.message)
        }

        // Revalidate all relevant paths
        revalidatePath("/")
        // revalidatePath("/posts")
        redirect("/")
        

        return { success: true }
        
    } catch (error) {
        console.error("Error deleting post:", error)
        throw error
    }
}

export default DeletePost