import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user } = req.query;
    const response = await fetch(
        `https://api.seaside.fm/superfaves?user_id=${user}`,
        {
            method: "GET",
        }
    ).then((res) => res.json());

    res.json(response);
}
