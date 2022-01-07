import fetch from "node-fetch";
import { TwitchRefreshResponse, TwitchTokenData } from "./structures/twitch";
import { Buffer } from "buffer";
import Cookies from "cookies";

const buildRefreshTokenURI = (refresh: TwitchTokenData["refresh_token"]) => {
    return `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${refresh}&client_id=${process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}`;
};

export const tryRefreshToken = async (
    refresh: TwitchTokenData["refresh_token"]
): Promise<TwitchRefreshResponse> => {
    return await fetch(buildRefreshTokenURI(refresh), {
        method: "POST",
    }).then((res) => res.json() as Promise<TwitchRefreshResponse>);
};

export async function withRefreshRetry<T, E extends string>({
    action,
    args,
    cookies,
    token,
}: {
    action: (...args: any[]) => Promise<{ data: T; error?: E }>;
    args: any[];
    cookies: Cookies;
    token: TwitchTokenData;
}): Promise<{ data?: T; error?: string; status: number }> {
    const { error, data } = await action(...args);

    if (error) {
        // need to get a new token
        if (error === "Unauthorized") {
            const newToken = await tryRefreshToken(token.refresh_token);
            if (newToken.error) {
                return {
                    status: 400,
                    error: "Application no longer authorized",
                };
            }

            cookies.set(
                "token",
                Buffer.from(JSON.stringify({ ...token, ...newToken })).toString(
                    "base64"
                )
            );

            const { error: secondTryError, data: secondTryData } = await action(
                ...args
            );

            if (secondTryData) {
                return { status: 200, data: secondTryData };
            }

            console.error(secondTryError);
        }
        return {
            status: 500,
            error: "Could not properly interface with Twitch",
        };
    }

    return { status: 200, data };
}
