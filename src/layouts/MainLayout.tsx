import React from "react";
import Head from "next/head";
import { Navbar } from "../components/Navbar";
import { useQuery } from "react-query";
import { useUserState } from "../context/UserContext";
import { TwitchUser } from "../structures/twitch";

export const MainLayout: React.FC = ({ children }) => {
    const userState = useUserState();
    const { isLoading } = useQuery(["user-info"], async () => {
        const res = await fetch("/api/user/info", {
            method: "GET",
        });

        if (res.status >= 400) {
            console.log("No token available");
        }

        const userData: { data: TwitchUser; error: string } = await res.json();

        if (!userState.user && !userData.error) {
            userState.actions.setUser(userData.data);
        }

        if (userData.error) {
            throw new Error(userData.error);
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
                {isLoading && (
                    <div
                        style={{
                            height: "100%",
                        }}
                        className={
                            "is-flex is-align-items-center is-justify-content-center"
                        }
                    >
                        Loading page info...
                    </div>
                )}
                {!isLoading && children}
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
                            Duke_Ferdinand
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
