import { create } from 'zustand'
export type User = {
    email: string;
    given_name: string;
    famly_name: string;
    user_name?: string;
    id: string;
    picture: string;
}

export type UserState = {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}
export const useUserStore = create<UserState>((set) => ({
    user: {
        email: "",
        given_name: "",
        famly_name: "",
        id: "",
        picture: "",
    },
    setUser: (user) => set({ user: user }),
    logout: () => {
        set({ user: null });
    },
}));
