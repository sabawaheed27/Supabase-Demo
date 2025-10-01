import { createServerClient } from "@supabase/ssr";
import { Database } from "./database.type";
import { cookies } from "next/headers";



export const createClient=  async()=>{
     const cookiesStore = await cookies();

    return createServerClient<Database>(
       
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISABLE_KEY!,
        {
            cookies:{
                getAll(){
                    return cookiesStore.getAll()

                },
                setAll(cookiesToSet){
                    try{
                        cookiesToSet.forEach(({name, value, options})=>{
                            cookiesStore.set({name, value, ...options})
                        
                        })
                    }catch{}
                }

            }
        }
        
    )

}