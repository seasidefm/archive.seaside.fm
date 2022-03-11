import {
    getTwitchToken,
    tryValidation,
    withRefreshRetry,
} from "../server-utils";
import { TwitchTokenData } from "../structures/twitch";
import { NextApiRequest, NextApiResponse } from "next";

const getUsername = async function (accessToken: string) {
    return await tryValidation(accessToken);
};

export const withTwitchVerification = async <T>(
    req: NextApiRequest,
    res: NextApiResponse,
    callback: (userId: string) => T
) => {
    const token = getTwitchToken(req, res);

    // No token, not authorized
    if (token.error) {
        return res.status(401).json({ error: token.error });
    }

    // Try to get the username
    const tokenResponse = await withRefreshRetry({
        cookies: token.cookies,
        action: getUsername,
        token: token.twitchAccessData as TwitchTokenData,
        args: [token.twitchAccessData?.access_token],
    });

    if (tokenResponse.error) {
        return res
            .status(tokenResponse.status)
            .json({ error: tokenResponse.error });
    }

    // Use username to get favorites
    const user_id = tokenResponse.data?.user_id;
    if (!user_id) {
        return res.status(400).json({ error: "User token is invalid" });
    }

    return callback(user_id);
};
