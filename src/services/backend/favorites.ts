import { getFavoritesModel } from "./database/db";

export class Favorites {
    async getFavoritesLeaderboard() {
        const favorites = await getFavoritesModel();
        const leaderboard = await favorites
            .aggregate([
                {
                    $match: {
                        user: {
                            // Remove myself from the running!
                            $ne: "duke_ferdinand",
                        },
                    },
                },
                {
                    $project: {
                        user: 1,
                        numberOfSongs: {
                            $size: "$songs",
                        },
                    },
                },
                {
                    $sort: {
                        numberOfSongs: -1,
                    },
                },
            ])
            .exec();

        console.log(leaderboard);

        return leaderboard;
    }
    async getFavoriteSongs(user: string) {
        const favorites = await getFavoritesModel();
        const results = await favorites.find({ user: { $eq: user } });

        const favoritesObject = results[0];

        return favoritesObject.toJSON().songs;
    }
    async deleteFavorite(user: string, song: string) {
        const favorites = await getFavoritesModel();
        const results = await favorites.updateOne(
            { user: { $eq: user } },
            { $pull: { songs: { song } } }
        );

        console.info(results);

        return true;
    }
}
