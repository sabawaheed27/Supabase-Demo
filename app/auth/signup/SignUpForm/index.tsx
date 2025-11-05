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
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full">
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
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm 
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
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
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
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
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
          />
          {errors.password && <ErrorMessage message={errors.password.message!} />}
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white 
                     font-semibold py-2.5 rounded-lg shadow-md transition duration-200 
                     disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating..." : "Sign Up"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error.message}
        </p>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link 
          href="/auth/login" 
          className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors"
        >
          Log in here
        </Link>
      </p>
    </div>
  )
}

export default SignUpForm