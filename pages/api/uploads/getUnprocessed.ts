import { NextApiRequest, NextApiResponse } from "next";
import { VideoStorage } from "../../../src/services/backend/archives/fileStorage";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const storage = new VideoStorage("streams");
    try {
        const files = await storage.getUnprocessedUploads();
        res.json({ data: files });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: (e as Error).message,
        });
    }
}
