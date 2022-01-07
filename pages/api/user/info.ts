import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import fetch from "node-fetch";
import {
    TwitchTokenData,
    TwitchUser,
    TwitchUserInfoResponse,
} from "../../../src/structures/twitch";
import { withRefreshRetry } from "../../../src/server-utils";
import { Buffer } from "buffer";

const getUserInfo = async (accessData: TwitchTokenData) => {
    const userInfo = await fetch("https://id.twitch.tv/oauth2/userinfo", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessData.access_token}`,
        },
    }).then((res) => res.json() as Promise<TwitchUserInfoResponse>);

    return await fetch(
        `https://api.twitch.tv/helix/users?login=${userInfo.preferred_username}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessData.access_token}`,
                "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || "",
            },
        }
    ).then(
        (res) => res.json() as Promise<{ data: TwitchUser[]; error?: string }>
    );
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const cookies = new Cookies(req, res);

    const token = cookies.get("token");
    if (!token) {
        return res.status(401).json({
            error: "Missing `token` cookie",
        });
    }

    const tokenJSONString = Buffer.from(token, "base64").toString();
    const twitchAccessData: TwitchTokenData = JSON.parse(tokenJSONString);

    const { data, error, status } = await withRefreshRetry({
        action: getUserInfo,
        args: [twitchAccessData],
        token: twitchAccessData,
        cookies,
    });

    return res.status(status).json({ data: data && data[0], error });
}
