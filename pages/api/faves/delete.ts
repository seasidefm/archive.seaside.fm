import { NextApiRequest, NextApiResponse } from "next";
import {
    getAuthHeaders,
    getJSONHeaders,
    withTwitchVerification,
} from "../../../src/server/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const { fave_id } = req.body;

    await withTwitchVerification(req, res, async (user_id) => {
        console.log("Verification complete, trying delete");
        const response = await fetch("https://api.seaside.fm/faves", {
            headers: { ...getAuthHeaders(), ...getJSONHeaders() },
            method: "DELETE",
            body: JSON.stringify({
                user_id,
                fave_id,
            }),
        });

        console.log(await response.text());

        res.json(response);
    });
}
