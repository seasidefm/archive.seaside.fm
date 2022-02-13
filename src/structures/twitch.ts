export interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string; // ISO Date?
}

export interface TwitchTokenData {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string[];
    token_type: "bearer";
}

export interface TwitchRefreshResponse {
    access_token: string;
    refresh_token: string;
    scope: string[];
    token_type: "bearer";
    error?: string;
}

export interface TwitchValidationResponse {
    client_id: "wbmytr93xzw8zbg0p1izqyzzc5mbiz";
    login: "twitchdev";
    scopes: ["channel:read:subscriptions"];
    user_id: "141981764";
    expires_in: 5520838;
}

export interface TwitchUserInfoResponse {
    aud: string;
    exp: number;
    iat: 1641498027;
    iss: string;
    sub: string;
    azp: string;
    preferred_username: string;
}

export type DataOrError<T> = {
    data?: T;
    error?: string;
    status: number;
};
