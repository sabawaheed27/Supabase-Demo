
'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SignUp } from "@/action/sign-up";
import ErrorMessage from "@/app/components/ErrorMessage";
import { signUpSchema} from "@/action/schema";

const SignUpForm = () => {
  const {
    register,
    handleSubmit, 
    
    formState: { errors }} = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate, error } = useMutation({
    mutationFn: SignUp,
  });



  return (
    <>
      <form
         onSubmit={handleSubmit(value => mutate(value))}className="flex flex-col mb-4">

        <fieldset>
          <label htmlFor="email">Enter your Email</label><input className="ml-2 mb-4"{...register("email")}type="email"id="email" placeholder="Enter your Email"/>
          {errors.email && <ErrorMessage message={errors.email.message!} />}
        </fieldset>

        <fieldset>
          <label htmlFor="username">Enter your Username</label>
          <input className="ml-2 mb-4"{...register("username")}type="text"id="username"placeholder="Enter your username"/>
          {errors.username && <ErrorMessage message={errors.username.message!} />}
        </fieldset>

        <fieldset>
          <label htmlFor="password">Password</label>
          <input className="ml-2 mb-4"{...register("password")}type="password"id="password"placeholder="Enter your password"/>
          {errors.password && <ErrorMessage message={errors.password.message!} />}
        </fieldset>

        <button className="button-secondary w-1/2 m-auto">Sign Up</button>
      </form>

      {error && <p className="text-red-500">{error.message}</p>}
    </>
  );
};

export default SignUpForm;
