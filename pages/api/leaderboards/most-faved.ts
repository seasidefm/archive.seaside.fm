import { NextApiRequest, NextApiResponse } from "next";
import { Favorites } from "../../../src/services/backend/favorites";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const favorites = new Favorites();
    const faveList = await favorites.getMostFaved();

    res.json({ data: faveList });
}
