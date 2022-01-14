import { NextApiRequest, NextApiResponse } from "next";
import {
    getTwitchToken,
    tryValidation,
    withRefreshRetry,
} from "../../../src/server-utils";
import { TwitchTokenData } from "../../../src/structures/twitch";
import { Requests } from "../../../src/services/backend/requests";

const getUsername = async function (accessToken: string) {
    return await tryValidation(accessToken);
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const token = getTwitchToken(req, res);

    // No token, not authorized
    if (token.error) {
        return res.status(401).json({ error: token.error });
    }

    // Try to get the username
    const response = await withRefreshRetry({
        cookies: token.cookies,
        action: getUsername,
        token: token.twitchAccessData as TwitchTokenData,
        args: [token.twitchAccessData?.access_token],
    });

    if (response.error) {
        return res.status(response.status).json({ error: response.error });
    }

    // Use username to get favorites
    const username = response.data?.login;
    if (!username) {
        return res.status(400).json({ error: "Unable to get username" });
    }
    const requests = new Requests();
    const reqList = await requests.getUserRequests(username);

    res.json({ data: reqList });
}
