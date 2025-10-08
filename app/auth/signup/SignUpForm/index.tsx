'use client'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { SignUp } from "@/action/sign-up"
import ErrorMessage from "@/app/components/ErrorMessage"
import { signUpSchema } from "@/action/schema"
import Link from "next/link"

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  })

  const { mutate, error, isPending } = useMutation({
    mutationFn: SignUp,
  })

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/signup.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md shadow-2xl rounded-xl p-6 sm:p-8 w-[90%] max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h2>

        <form
          onSubmit={handleSubmit((value) => mutate(value))}
          className="flex flex-col gap-y-4"
        >
          {/* Email */}
          <fieldset className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Enter your Email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
            {errors.email && <ErrorMessage message={errors.email.message!} />}
          </fieldset>

          {/* Username */}
          <fieldset className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
            {errors.username && <ErrorMessage message={errors.username.message!} />}
          </fieldset>

          {/* Password */}
          <fieldset className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
            {errors.password && <ErrorMessage message={errors.password.message!} />}
          </fieldset>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 
                       rounded-lg shadow-md transition duration-200 disabled:opacity-70"
          >
            {isPending ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error.message}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUpForm
