'use client';

import { SetStateAction, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSearchedPosts } from "@/utils/supabase/queries";
import { useQuery } from "@tanstack/react-query";

const SearchInput = () => {
  const [userInput, setUserInput] = useState<string>("");

  // React Query for handling search results, loading, and errors
  const { data, isLoading, isError } = useQuery({
    queryKey: ['search-results', userInput],
    queryFn: async () => {
      const { data, error } = await getSearchedPosts(userInput);
      if (error) throw error;
      return data;
    },
    enabled: !!userInput && userInput.length > 0, // only runs if input is not empty
  });

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Input box */}
      <div className="flex items-center rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm 
                      focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
        <Search width={20} height={20} className="mr-2 text-gray-400" />
        <input
          type="text"
          onChange={handleChange}
          value={userInput}
          name="search"
          placeholder="Search posts..."
          className="w-full rounded-full bg-[#F6F7F8] border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-[#FF4500]"
        />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute left-0 right-0 mt-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
          Searching...
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute left-0 right-0 mt-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-red-500 shadow-lg">
          Something went wrong. Please try again.
        </div>
      )}

      {/* Results dropdown */}
      {data && data.length > 0 && (
        <div
          onClick={() => setUserInput("")}
          className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-lg border border-gray-200 
                     bg-white shadow-lg animate-fade-in z-10">
          {data.map(({ id, title, slug }) => (
            <Link
              key={id}
              href={`/${slug}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
              {title}
            </Link>
          ))}
        </div>
      )}

      {/* No results found */}
      {data && data.length === 0 && (
        <div className="absolute left-0 right-0 mt-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
          No results found.
        </div>
      )}
    </div>
  );
};

export default SearchInput;





//User types in input → updates userInput.
//React Query fetches posts matching the input from Supabase.
//Results show up in a dropdown.
//Clicking a result navigates to that post and clears the input.