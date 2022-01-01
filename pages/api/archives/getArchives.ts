import { NextApiRequest, NextApiResponse } from "next";
import { ArchiveFileStorage } from "../../../src/services/backend/archives/fileStorage";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const storage = new ArchiveFileStorage("streams");
    try {
        const files = await storage.getAllFiles();
        res.json({ data: files });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: (e as Error).message,
        });
    }
}
