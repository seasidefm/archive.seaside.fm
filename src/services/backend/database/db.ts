import { Connection } from "mongoose";
import mongoose from "mongoose";
import { FavoriteModel } from "./Favorite.model";

let connection: Connection | undefined;
export async function withDBConnection() {
    if (!connection) {
        const url = process.env.MONGO_CONNECTION;
        if (!url) {
            throw new Error("[env] Cannot find MONGO_CONNECTION in env!");
        }

        await mongoose.connect(url);
        connection = mongoose.connection;
    }
}

export const getFavoritesModel = async () => {
    await withDBConnection();
    return FavoriteModel;
};
