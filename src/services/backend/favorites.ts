import { getFavoritesModel } from "./database/db";

export class Favorites {
    async getMostFaved() {
        const favorites = await getFavoritesModel();
        //https://stackoverflow.com/questions/34089056/count-array-occurrences-across-all-documents-with-mongoa
        return await favorites
            .aggregate([
                {
                    $match: {
                        user: {
                            $not: {
                                $in: ["duke_ferdinand", "seasidefm"],
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: "songs",
                        songList: {
                            $push: "$songs.song",
                        },
                    },
                },
                {
                    $unwind: {
                        path: "$songList",
                    },
                },
                {
                    $unwind: {
                        path: "$songList",
                    },
                },
                {
                    $group: {
                        _id: {
                            song: "$_id",
                            songName: "$songList",
                        },
                        songCount: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        songCount: -1,
                        "_id.songName": 1,
                    },
                },
                {
                    $group: {
                        _id: "$_id.song",
                        songs: {
                            $push: {
                                name: "$_id.songName",
                                faveCount: "$songCount",
                            },
                        },
                    },
                },
            ])
            .exec();
    }
    async getFavoritesLeaderboard() {
        const favorites = await getFavoritesModel();
        return await favorites
            .aggregate([
                {
                    $match: {
                        user: {
                            // Remove myself and seasidefm from the running!
                            $not: {
                                $in: ["duke_ferdinand", "seasidefm"],
                            },
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
