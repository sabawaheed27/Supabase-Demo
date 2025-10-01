'use client'
import { SetStateAction, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getSearchedPosts } from "@/utils/supabase/queries";
import { useQuery } from "@tanstack/react-query";

const SearchInput = () => {
    const [userInput, setUserInput] = useState<string>("");
//Updates every time the user types in the search box.
    const { data } = useQuery({
        queryKey: ['search-results', userInput],// queryKey Unique key for caching results
        queryFn: async () => { // runs the actual fetch
            const { data, error } = await getSearchedPosts(userInput) //call
            if (error) throw new Error; //if supabase return error throw error 
            return data;
        },
        enabled: userInput && userInput.length > 0 ? true : false,
        //enabled: Only runs when the input isn’t empty (userInput.length > 0).
    })


    const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setUserInput(e.target.value)
    } //This re-triggers the queryFn (because userInput changed in the queryKey).

    return (
        
           <div className="relative w-full max-w-md">
      {/* Input box with icon */}
      <div className="flex items-center rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm 
                      focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
        <Search width={20} height={20} className="mr-2 text-gray-400" />
        <input
          onChange={handleChange}
          value={userInput}
          name="search"
          placeholder="Search posts by title..."
          className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Dropdown results */}
      {data &&  (
        <div
          onClick={() => setUserInput("")}
          className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-lg border border-gray-200 
                     bg-white shadow-lg animate-fade-in z-10"
        >
          {data.map(({ id, title, slug }) => (
            <Link
              key={id}
              href={`/${slug}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              {title}
            </Link>
          ))}
        </div>
      )}

      {/* No results state */}
      {data && (
        <div className="absolute left-0 right-0 mt-2 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
          No results found.
        </div>
      )}
    </div>
  );
}


export default SearchInput;


//User types in input → updates userInput.
//React Query fetches posts matching the input from Supabase.
//Results show up in a dropdown.
//Clicking a result navigates to that post and clears the input.