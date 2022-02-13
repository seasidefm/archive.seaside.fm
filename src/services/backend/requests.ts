import { getRequestsModel } from "./database/db";

export class Requests {
    async getUserRequests(username: string) {
        const requests = await getRequestsModel();
        return requests.find({ user: username }, { notes: 0, ripped: 0 });
    }
}
