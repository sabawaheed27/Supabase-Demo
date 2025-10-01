'use client'
import { LogIn } from "@/action/log-in"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logInSchema } from "@/action/schema"
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "@/app/components/ErrorMessage";



const LogInForm = () => {
    const {
    register,
        handleSubmit,
        formState: { errors }} = useForm({
        resolver: zodResolver(logInSchema)
        })

        const {mutate, isPending, error} = useMutation({
            mutationFn: LogIn,
        })
    return (
        <>
            <form onSubmit={handleSubmit(values =>  mutate(values))} className="flex flex-col mb-4  ">

                <fieldset>
                    <label htmlFor="email">Enter your Email</label>
                    <input className="ml-2 mb-4" {...register('email')} type="email" id="email" name="email" placeholder="Enter your Email" />
                    {errors.email && <ErrorMessage message={errors.email.message!} />}
                </fieldset>
                <fieldset>
                    <label htmlFor="password">Password</label>
                    <input type="password" className="ml-2 mb-4 px-2" {...register('password')} id="password" name="password" placeholder="Enter your password" />
                    {errors.password && <ErrorMessage message={errors.password.message!} />}

                </fieldset>
                <button className="button-secondary w-1/2 m-auto">{isPending ? 'Loading...' : 'Log In'}</button>

            </form>
            {error && <ErrorMessage message={error.message} />}
          
        </>
    )
}
export default LogInForm;