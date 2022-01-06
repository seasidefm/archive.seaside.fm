import { NextApiRequest, NextApiResponse } from "next";
import { VideoStorage } from "../../src/services/backend/archives/fileStorage";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { v } = req.query;
    const { range } = req.headers;
    if (!range) {
        return res.status(400).send("Range header is required!");
    }

    // Get a video storage service class
    const storage = new VideoStorage("streams");

    // Get the requested stream chunk
    const { start, end, chunkLength, videoLength, stream } =
        await storage.getStreamChunk(`${v}.mp4`, range);

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoLength}`,
        "Accept-Ranges": `bytes`,
        "Content-Length": chunkLength,
        "Content-Type": "video/mp4",
    };

    // Set status code, apply headers before streaming data
    res.writeHead(206, headers);

    stream.on("end", () => {
        console.log("Served my MinIO");
    });
    stream.pipe(res);
}
