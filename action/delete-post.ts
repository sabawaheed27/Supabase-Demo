'use server'

''
import { createClient } from "@/utils/supabase/server-client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"


const DeletePost =async (postId: number)=>{
    const supabase = await createClient()
    const {error} = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .throwOnError()

    revalidatePath("/")
 
    redirect('/')
}

export default DeletePost