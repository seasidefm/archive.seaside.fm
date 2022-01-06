import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
import { Buffer } from "buffer";
import Cookies from "cookies";

const buildRequestString = (code: string) => {
    const redirect = process.env.NEXT_PUBLIC_TWITCH_REDIRECT,
        clientId = process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
        secret = process.env.TWITCH_CLIENT_SECRET;
    if (!redirect || !clientId || !secret) {
        throw new Error("Cannot find one of redirect, clientId, or secret!");
    }
    return `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${secret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirect}`;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Only POST is allowed!",
        });
    }

    const { code } = req.body;
    const reqString = buildRequestString(code);

    const tokenData = await fetch(reqString, {
        method: "POST",
    });

    if (tokenData.status >= 400) {
        console.error(tokenData);
        return res.status(500).send("Something went wrong!");
    }
    const cookies = new Cookies(req, res);

    const newToken = await tokenData.json();

    // Twitch validates these for us, so just stringify and send it out
    // NOTE: this is HTTP Only!
    cookies.set(
        "token",
        Buffer.from(JSON.stringify(newToken)).toString("base64")
    );

    res.status(200).json({
        data: "OK",
    });
}
