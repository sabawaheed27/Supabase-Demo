'use server'
import { signUpSchema } from "@/action/schema"
import { createClient } from "@/utils/supabase/server-client"
import { redirect } from "next/navigation"
import z from "zod"

export const SignUp = async(userdata:z.infer<typeof signUpSchema>)=>{
  const validatedFields = signUpSchema.safeParse(userdata);

  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: signUpError } = await supabase.auth.signUp(validatedFields.data);

    if (signUpError) {
      // This will catch errors like "User already registered"
      throw signUpError;
    }

    if (user) {
      // This part is for creating a public user profile, which is good practice.
      await supabase
        .from('users')
        .insert({ id: user.id, email: validatedFields.data.email, username: validatedFields.data.username })
        .throwOnError();
    }
  } catch (error: any) {
    console.error('Sign Up Error:', error);
    return { error: error.message || "Could not sign up user." };
  }

  redirect("/");
}
