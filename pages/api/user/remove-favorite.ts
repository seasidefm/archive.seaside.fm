import { NextApiRequest, NextApiResponse } from "next";
import { Favorites } from "../../../src/services/backend/favorites";
import {
    getTwitchToken,
    tryValidation,
    withRefreshRetry,
} from "../../../src/server-utils";
import { TwitchTokenData } from "../../../src/structures/twitch";

const getUsername = async function (accessToken: string) {
    return await tryValidation(accessToken);
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const { song } = req.body;
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
    const favorites = new Favorites();
    const faveList = await favorites.deleteFavorite(username, song);

    res.json({ data: faveList });
}
