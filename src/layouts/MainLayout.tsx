import React from "react";
import Head from "next/head";
import { Navbar } from "../components/Navbar";
import { useQuery } from "react-query";
import { useUserState } from "../context/UserContext";

export const MainLayout: React.FC = ({ children }) => {
    const userState = useUserState();
    const { data, isLoading } = useQuery(["user-info"], async () => {
        const res = await fetch("/api/user/info", {
            method: "GET",
        });

        if (res.status >= 400) {
            console.log("No token available");
        }

        const userData = await res.json();

        if (!userData.user) {
            userState.actions.setUser(userData);
        }

        return userData;
    });
    return (
        <div
            className={"is-flex is-flex-direction-column"}
            style={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <Head>
                <title>Home - SeasideFM Archive</title>
            </Head>
            <div
                className="container"
                style={{
                    width: "100%",
                }}
            >
                <Navbar />
                {isLoading && "loading..."}
                {data && <pre>{JSON.stringify(data)}</pre>}
                {children}
            </div>
            <footer className="footer mt-auto">
                <div className="content has-text-centered">
                    <p>
                        <strong>Video content</strong> created under Fair Use
                        conditions by{" "}
                        <a href="https://twitch.tv/seasidefm">SeasideFM</a>.
                        Content is licensed under Creative Commons except where
                        not applicable by law.
                        <br />
                        <strong>Website</strong> programmed by{" "}
                        <a href="https://github.com/DukeFerdinand">
                            Doug Flynn
                        </a>
                        . The source code is licensed{" "}
                        <strong>
                            <a href="http://opensource.org/licenses/mit-license.php">
                                MIT
                            </a>
                        </strong>
                        .
                    </p>
                </div>
            </footer>
        </div>
    );
};
