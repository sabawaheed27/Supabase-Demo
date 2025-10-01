'use client'

import { QueryClient, QueryClientProvider as OriginalQueryClientProvider } from '@tanstack/react-query'

const makeQueryClient = () => {
    return new QueryClient()
}//Creates a fresh QueryClient.

let browserQueryClient: QueryClient | undefined = undefined;
//Holds a single instance of QueryClient on the browser so you don’t keep creating new ones every time React re-renders.
export const getQueryClient = () => {
    if (typeof window === 'undefined') {
        //server always make a fresh one
        return makeQueryClient();
    } else {
// Browser → reuse the same one
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