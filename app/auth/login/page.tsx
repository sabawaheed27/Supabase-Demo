import Link from "next/link";
import LogInForm from "./LogoInForm";

const LogInPage = () => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full">
      <h2 className="font-bold text-2xl sm:text-3xl mb-6 text-center text-gray-800">
        Log In
      </h2>
      <LogInForm />
      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link 
          href="/auth/signup" 
          className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors">
          Sign up here!
        </Link>
      </p>
    </div>
  );
};

export default LogInPage;