import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContextProvider } from "../src/context/UserContext";

function MyApp({ Component, pageProps }: AppProps) {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <UserContextProvider>
                <Component {...pageProps} />
            </UserContextProvider>
        </QueryClientProvider>
    );
}

export default MyApp;
