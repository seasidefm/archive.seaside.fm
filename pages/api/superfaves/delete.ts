import { NextApiRequest, NextApiResponse } from "next";
import { withTwitchVerification } from "../../../src/server/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const { fave_id } = req.body;

    await withTwitchVerification(req, res, async (user_id) => {
        const response = await fetch("https://api.seaside.fm/superfaves", {
            method: "DELETE",
            body: JSON.stringify({
                user_id,
                fave_id,
            }),
        }).then((res) => res.json());

        res.json(response);
    });
}
