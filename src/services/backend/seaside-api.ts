type UserFavoritesLeaderboard = Array<{
    _count: { favorites: number };
    name: string;
}>;

export class SeasideApi {
    private readonly endpoint: string;
    private readonly routes = {
        FaveLeaderboard: "/leaderboard/favorites",
    };

    constructor() {
        const endpoint = process.env.NEXT_PUBLIC_SEASIDE_API_URI;

        if (!endpoint) {
            throw new Error("Cannot find SEASIDE_API_URI in env!");
        }

        this.endpoint = endpoint;
    }

    private prependEndpoint(route: string) {
        return `${this.endpoint}${route}`;
    }

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
