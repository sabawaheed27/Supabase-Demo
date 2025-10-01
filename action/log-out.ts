'use server'

import { createClient } from "@/utils/supabase/server-client"
import { redirect } from "next/navigation"
    


export const Logout = async ()=>{
    const supabase = await createClient()
    await supabase.auth.signOut()

    redirect("/")
}