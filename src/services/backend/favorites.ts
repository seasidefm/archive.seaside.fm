import { getFavoritesModel } from "./database/db";

export class Favorites {
    async getFavoriteSongs(user: string) {
        const favorites = await getFavoritesModel();
        const results = await favorites.find({ user: { $eq: user } });

        const favoritesObject = results[0];

        return favoritesObject.toJSON().songs;
    }
}
