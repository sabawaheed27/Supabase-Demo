'use client'
import { LogIn } from "@/action/log-in"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logInSchema } from "@/action/schema"
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "@/app/components/ErrorMessage";
import { useState } from "react";
import { z } from "zod";

const LogInForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    
    const {
        register,
        handleSubmit,
        formState: { errors } 
    } = useForm<z.infer<typeof logInSchema>>({
        resolver: zodResolver(logInSchema)
    })

    const { mutate, isPending } = useMutation({
        mutationFn: LogIn,
        onSuccess: (result) => {
            // If there's a result, it means there was an error
            // If no result (undefined), the redirect happened successfully
            if (result && result.error) {
                setServerError(result.error);
            } else {
                setServerError(null);
            }
        },
        onError: (error: any) => {
            setServerError("An unexpected error occurred. Please try again.");
            console.error("Login mutation error:", error);
        }
    });

    return (
        <>
            <form onSubmit={handleSubmit(values => mutate(values))}
                className="flex flex-col gap-y-4">

                {/* Email */}
                <fieldset className="flex flex-col space-y-1">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        {...register('email')}
                        type="email"
                        id="email"
                        placeholder="Enter your Email"
                        className="w-full rounded-lg border-gray-300 px-4 py-2 text-gray-900 shadow-sm
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"/>
                    {errors.email && <ErrorMessage message={errors.email.message!} />}
                </fieldset>

                {/* Password */}
                <fieldset className="flex flex-col space-y-1">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        {...register('password')}
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        className="w-full rounded-lg border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" />
                    {errors.password && <ErrorMessage message={errors.password.message!} />}
                </fieldset>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 
                     rounded-lg shadow-md transition duration-200 disabled:opacity-70"
                    disabled={isPending}>
                    {isPending ? "Loading..." : "Log In"}
                </button>
            </form>

            {/* Display server errors */}
            {serverError && (
                <div className="mt-4">
                    <ErrorMessage message={serverError} />
                </div>
            )}
        </>
    )
}

export default LogInForm