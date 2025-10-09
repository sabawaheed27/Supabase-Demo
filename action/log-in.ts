'use server'

import { redirect } from "next/navigation"
import { logInSchema } from "./schema"
import { z } from "zod"
import { createClient } from "@/utils/supabase/server-client"


export const LogIn = async (userdata:z.infer<typeof logInSchema>) => {
  // 1. Use safeParse for validation to avoid throwing an error
  const validatedFields = logInSchema.safeParse(userdata);

  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  try {
    const supabase = await createClient()
    // 2. Check the error property from the signInWithPassword response
    const { error } = await supabase.auth.signInWithPassword(validatedFields.data);

    if (error) {
      throw error; // Throw the error to be caught by the surrounding catch block
    }
  } catch (error) {
    // 3. Return a specific, user-friendly error message
    return { error: "Invalid email or password." };
  }

  // 4. Only redirect on success
  redirect("/");
}