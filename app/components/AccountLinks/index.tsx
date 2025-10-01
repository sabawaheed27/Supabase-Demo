import { createClient } from "@/utils/supabase/server-client";
import Link from "next/link";
import LogOutButton from "./LogOutButton";

const AccountLinks = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          {/* Create Post button */}
          <Link
            href="/create"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 
                       hover:bg-blue-700 transition-colors shadow-sm"
          >
            Create Post
          </Link>

          {/* Logout button */}
          <LogOutButton />
        </>
      ) : (
        <>
          {/* Sign up */}
          <Link
            href="/auth/signup"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 
                       hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  );
};

export default AccountLinks;
