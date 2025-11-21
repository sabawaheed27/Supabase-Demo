
'use server'

import { signUpSchema } from "@/action/schema"
import { createClient } from "@/utils/supabase/server-client"
import { redirect } from "next/navigation"
import z from "zod"
import type { ActionResult } from "@/action/schema"

export const SignUp = async (userdata: z.infer<typeof signUpSchema>): Promise<ActionResult> => {
  const validatedFields = signUpSchema.safeParse(userdata);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields provided." };
  }

  try {
    const supabase = await createClient();
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', validatedFields.data.email)
      .single();

    if (existingUser) {
      return { success: false, error: "This email is already registered." };
    }

    const { data: { user }, error: signUpError } = await supabase.auth.signUp(validatedFields.data);

    if (signUpError) {
      // Check for specific error types
      if (signUpError.message.includes("already registered")) {
        return { success: false, error: "This email is already registered." };
      }
      return { success: false, error: signUpError.message };
    }

    if (user) {
      // Create a public user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({ 
          id: user.id, 
          email: validatedFields.data.email, 
          username: validatedFields.data.username 
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { success: false, error: "Account created but profile setup failed. Please contact support." };
      }
    }
  } catch (error: any) {
    console.error('Sign Up Error:', error);
    return { success: false, error: error.message || "Could not sign up user." };
  }

  redirect("/");
}