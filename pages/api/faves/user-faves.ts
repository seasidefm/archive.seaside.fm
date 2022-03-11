import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const response = await fetch(
        `https://api.seaside.fm/faves/user?user_id=128541740`,
        {
            method: "GET",
        }
    ).then((res) => res.json());

    res.json(response);
}
