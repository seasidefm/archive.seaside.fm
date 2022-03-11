import create from "zustand";
import { produce } from "immer";

import { TwitchUser } from "../structures/twitch";
import fetch from "node-fetch";

export interface UserStore {
    user: TwitchUser | null;
    getTwitchData: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    getTwitchData: async () => {
        const data = await fetch(`${process.env.NEXT_PUBLIC_SEASIDE_API_URI}/`);
        // set(produce((s: UserStore) => s.user));
    },
}));
