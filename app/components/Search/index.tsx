'use client';

import { SetStateAction, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSearchedPosts } from "@/utils/supabase/queries";
import { useQuery } from "@tanstack/react-query";

const SearchInput = () => {
  const [userInput, setUserInput] = useState<string>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search-results', userInput],
    queryFn: async () => {
      const { data, error } = await getSearchedPosts(userInput);
      if (error) throw error;
      return data;
    },
    enabled: !!userInput && userInput.length > 0,
  });

  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="relative w-full">
      {/* Input box - FIXED: removed duplicate rounded-full and border styling */}
      <div className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm 
                      focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
        <Search width={18} height={18} className="mr-2 text-gray-400 shrink-0" />
        <input
          type="text"
          onChange={handleChange}
          value={userInput}
          name="search"
          placeholder="Search posts..."
          className="w-full bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute left-0 right-0 mt-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg z-50">
          Searching...
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute left-0 right-0 mt-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-red-500 shadow-lg z-50">
          Something went wrong. Please try again.
        </div>
      )}

      {/* Results dropdown */}
      {data && data.length > 0 && (
        <div
          className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-lg border border-gray-200 
                     bg-white shadow-lg z-50">
          {data.map(({ id, title, slug }) => (
            <Link
              key={id}
              href={`/${slug}`}
              onClick={() => setUserInput("")}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition border-b border-gray-100 last:border-b-0">
              {title}
            </Link>
          ))}
        </div>
      )}

      {/* No results found */}
      {data && data.length === 0 && userInput && (
        <div className="absolute left-0 right-0 mt-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg z-50">
          No results found for "{userInput}"
        </div>
      )}
    </div>
  );
};

export default SearchInput;