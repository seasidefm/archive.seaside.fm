import { ApiBaseService } from "./apiBaseService";

export class AuthService extends ApiBaseService {
    constructor() {
        super({
            FaveLeaderboard: "/leaderboard/favorites",
        });
    }
}
