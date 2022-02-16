export class ApiBaseService {
    private readonly endpoint: string;
    public readonly routes: Record<string, string>;

    constructor(routes: Record<string, string>) {
        const endpoint = process.env.NEXT_PUBLIC_SEASIDE_API_URI;

        if (!endpoint) {
            throw new Error("Cannot find SEASIDE_API_URI in env!");
        }

        this.endpoint = endpoint;
        this.routes = routes;
    }

    public prependEndpoint(route: string) {
        return `${this.endpoint}${route}`;
    }
}
