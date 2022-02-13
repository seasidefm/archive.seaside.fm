import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContextProvider } from "../src/context/UserContext";
import { GDPRModalProvider } from "../src/context/GDPRContext";

function MyApp({ Component, pageProps }: AppProps) {
    const queryClient = new QueryClient();
    return (
        <GDPRModalProvider>
            <QueryClientProvider client={queryClient}>
                <UserContextProvider>
                    <Component {...pageProps} />
                </UserContextProvider>
            </QueryClientProvider>
        </GDPRModalProvider>
    );
}

export default MyApp;
