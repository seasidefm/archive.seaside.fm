import { TwitchUser } from "../structures/twitch";
import React, { createContext, useContext, useState } from "react";

export interface UserStateActions {
    setUser(user: UserState["user"]): void;
}

export interface UserState {
    user: TwitchUser | null;

    actions: UserStateActions;
}

const UserContext = createContext<UserState | undefined>(undefined);

export const useUserState = () => {
    const ctx = useContext(UserContext);

    if (!ctx) {
        throw new Error("Cannot find UserContextProvider");
    }

    return ctx;
};

export const UserContextProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<UserState["user"]>(null);

    const actions: UserStateActions = {
        setUser(user: UserState["user"]) {
            setUser(user);
        },
    };

    return (
        <UserContext.Provider value={{ user, actions }}>
            {children}
        </UserContext.Provider>
    );
};
