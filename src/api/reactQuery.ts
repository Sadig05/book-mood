import { QueryClient } from "react-query";

export const BASE_URL = import.meta.env.VITE_BASE_URL

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            cacheTime: 10 * 60 * 1000,
            staleTime: 5 * 50 * 1000,
            retry: 2,
        }
    }
})