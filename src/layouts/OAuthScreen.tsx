import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

interface OAuthScreenProps {
    code?: string;
    scope?: string;
}

export const OAuthScreen: React.FC<OAuthScreenProps> = ({ code, scope }) => {
    const router = useRouter();
    const { data, isLoading, error } = useQuery(
        ["oauth-response"],
        async () => {
            const response = await fetch("/api/oauth-response", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    code,
                    scope,
                }),
            });
            if (response.status >= 400) {
                throw new Error("Something went wrong logging you in!");
            }
            const data = await response.json();
            if (data.data === "OK") {
                await router.replace("/");
            }
            return data;
        },
        { enabled: !!code && !!scope }
    );

    return (
        <div
            className={"is-flex is-flex-direction-column"}
            style={{
                height: "100vh",
                width: "100vw",
            }}
        >
            <div
                className="container is-flex is-align-content-center is-justify-content-center"
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                {JSON.stringify(data)}
                {isLoading && <strong>Communicating with Twitch...</strong>}
                {error && <pre>{(error as Error).message}</pre>}
            </div>
        </div>
    );
};
