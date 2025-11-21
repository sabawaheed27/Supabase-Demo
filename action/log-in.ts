
'use server'

import { redirect } from "next/navigation"
import { logInSchema } from "./schema"
import { z } from "zod"
import { createClient } from "@/utils/supabase/server-client"
import type { ActionResult } from "@/action/schema"


export const LogIn = async (userdata: z.infer<typeof logInSchema>): Promise<ActionResult> => {
  // 1. Use safeParse for validation to avoid throwing an error
  const validatedFields = logInSchema.safeParse(userdata);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields provided." };
  }

  try {
    const supabase = await createClient()
    // 2. Check the error property from the signInWithPassword response
    const { error } = await supabase.auth.signInWithPassword(validatedFields.data);

    if (error) {
      // Return specific error message based on error code
      if (error.message.includes("Invalid login credentials")) {
        return { success: false, error: "Invalid email or password." };
      }
      return { success: false, error: error.message };
    }
  } catch (error: any) {
    // 3. Return a specific, user-friendly error message
    console.error('Login error:', error);
    return { success: false, error: "Invalid email or password." };
  }

  // 4. Redirect on success
  redirect("/");
}