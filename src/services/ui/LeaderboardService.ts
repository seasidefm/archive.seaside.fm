import { ApiBaseService } from "./apiBaseService";

type UserFavoritesLeaderboard = Array<{
    _count: { favorites: number };
    name: string;
}>;

export class LeaderboardService extends ApiBaseService {
    constructor() {
        super({
            FaveLeaderboard: "/leaderboard/favorites",
        });
    }

    // Leaderboards
    // ====================================
    public async getLeaderboard(): Promise<UserFavoritesLeaderboard> {
        console.info("this is actually calling");
        const res = await fetch(
            this.prependEndpoint(this.routes.FaveLeaderboard),
            {
                method: "GET",
            }
        ).then((r) => r.json());

        if (!res.error) {
            return res.data as UserFavoritesLeaderboard;
        }

        throw new Error(
            "Error retrieving favorites leaderboard, try again in a bit!"
        );
    }
}
