import mongoose from "mongoose";
import { Model, Schema } from "mongoose";
import { DatabaseModels } from "./model";

export interface IFavorite {
    _id?: string;
    user: string;
    songs: Array<{
        song: string;
        timestamp: string;
        deleted?: boolean;
    }>;
}

const FavoriteSchema = new Schema<IFavorite>({
    user: String,
    songs: [
        {
            song: String,
            data: Number,
            deleted: {
                type: Boolean,
                optional: true,
            },
        },
    ],
});

export const FavoriteModel: Model<IFavorite> =
    mongoose.models[DatabaseModels.Favorite] ||
    mongoose.model(DatabaseModels.Favorite, FavoriteSchema, "saved_songs");
