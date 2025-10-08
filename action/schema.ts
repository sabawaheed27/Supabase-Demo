import {z} from 'zod'

export const logInSchema = z.object({
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long")
})
export const signUpSchema = z.object({
    email: z.email("Invalid email"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const postSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    content: z.string().min(3, "Content must be at least 3 characters"),
     image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5_000_000, "Max 5MB upload size")
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, .webp allowed"
    ),
})
