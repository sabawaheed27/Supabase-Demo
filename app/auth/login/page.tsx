
import Link from "next/link";
import LogInForm from "./LogoInForm";

const LogInPage = () => {
  return (
    <div className="min-h-screen h-screen w-screen flex items-center justify-center bg-cover bg-center " 
    style={{backgroundImage: "url('/images/login.jpg')"}}>
      
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="font-bold text-3xl mb-6 text-center text-gray-800">
          Log In
        </h2>
        <LogInForm />
        <p className="mt-6 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-red-500 font-semibold hover:underline">
            Sign up here!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogInPage;
