import { create } from "zustand";
import type { User } from "@/types/model.type";
import { storage } from "@/utils/storage";

type UserState = {
    users: User[];
    currentUserId: string | null;

    // actions
    register: (username: string, password: string) => void;
    login: (username: string, password: string) => void;
    logout: () => void;
    getCurrentUser: () => User | null;

    // persistence
    hydrate: () => Promise<void>;
    save: () => Promise<void>;
};

const hash = (s: string) => {
    let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
    return `h${h >>> 0}`;
};

const KEY = "sc:user:v1";

export const createUserStore = create<UserState>((set, get) => ({
    users: [],
    currentUserId: null,

    register: (username, password) => {
        const normalized = username.trim();
        if (!normalized) throw new Error("Username is required");
        if (get().users.some(u => u.username === normalized)) throw new Error("User already exists");

        const newUser: User = { id: normalized, username: normalized, passwordHash: hash(password) };
        set(s => ({ users: [...s.users, newUser] }));
        void get().save();
    },

    login: (username, password) => {
        const user = get().users.find(u => u.username === username);
        if (!user) throw new Error("User not found");
        if (user.passwordHash !== hash(password)) throw new Error("Invalid credentials");

        set({ currentUserId: user.id });
        void get().save();
    },

    logout: () => {
        set({ currentUserId: null });
        void get().save();
    },

    getCurrentUser: () => {
        const id = get().currentUserId;
        return id ? get().users.find(u => u.id === id) ?? null : null;
    },

    hydrate: async () => {
        const raw: string | null = await storage.getJSON(KEY);
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw) as Pick<UserState, "users" | "currentUserId">;
            set({ users: parsed.users ?? [], currentUserId: parsed.currentUserId ?? null });
        } catch { }
    },

    save: async () => {
        const snapshot: Pick<UserState, "users" | "currentUserId"> = {
            users: get().users,
            currentUserId: get().currentUserId,
        };
        await storage.setJSON(KEY, JSON.stringify(snapshot));
    },
}));

