import { createClient } from "@/utils/supabase/server-client";
import Link from "next/link";
import LogOutButton from "./LogOutButton";

const AccountLinks = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {user ? (
        <>
          {/* Create Post button */}
          <Link
            href="/create"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium 
                       text-white bg-[#FF4500] hover:bg-[#e03d00] active:bg-[#cc3700]
                       transition-colors whitespace-nowrap shadow-sm">
            Create
            <span className="hidden sm:inline"> Post</span>
          </Link>

          {/* Logout button */}
          <LogOutButton />
        </>
      ) : (
        <>
          {/* Login button */}
          <Link
            href="/auth/login"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium 
                       text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300
                       transition-colors whitespace-nowrap">
            Log In
          </Link>

          {/* Sign up button */}
          <Link
            href="/auth/signup"
            className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium 
                       text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                       transition-colors shadow-sm whitespace-nowrap">
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

export default AccountLinks;