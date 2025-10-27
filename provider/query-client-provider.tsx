'use client'

import { QueryClient, QueryClientProvider as OriginalQueryClientProvider } from '@tanstack/react-query'

const makeQueryClient = () => {//Creates a fresh QueryClient.
    return new QueryClient()
}
//This single line is doing two distinct things: declaring a type and assigning an initial value.
let browserQueryClient: QueryClient | null = null;
//On the server, Next.js might run your component multiple times (for SSR, streaming, etc.), so you never want to reuse a single global client there — it could cause data leaks between users.
//But in the browser, you do want to reuse one so you don’t reset your cache on every render.
export const getQueryClient = () => {
    if (typeof window === 'undefined') {        //server always make a fresh one
        return makeQueryClient();
    } else {// Browser → reuse the same one

        if(!browserQueryClient){
            browserQueryClient = makeQueryClient();

        }
        return browserQueryClient;

    }
}

export const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
 
    const queryClient = getQueryClient();
    return (
        <OriginalQueryClientProvider client = {queryClient}>
            {children}
        </OriginalQueryClientProvider>
    )
}; 
//QueryClient → the "engine" of React Query. It manages caching, background refetching, retries
//QueryClientProvider → a React Context Provider that makes the QueryClient available to your entire app
//You renamed it to OriginalQueryClientProvider so you can wrap it with your own custom QueryClientProvider.
//typeof window === 'undefined' → running on the server (SSR).
//→ Return a brand-new QueryClient for each request (important to avoid data sharing between users).
//Otherwise, running on the client.
//→ Reuse the same QueryClient (browserQueryClient) so your cache persists during navigation.

//Cache = temporary storage of data so you don’t need to fetch it again.
//When your app fetches data from an API, React Query stores that data in memory (the cache).
//Next time a component asks for the same data (useQuery(['todos'])), React Query can instantly return it from the cache instead of fetching again.