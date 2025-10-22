import { create } from "zustand";
import type { User } from "@/types/model.type";

type UserState = {
  users: User[];
  currentUserId: string | null;

  register: (username: string, password: string) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
  getCurrentUser: () => User | null;
};

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return `h${h >>> 0}`;
};

export const createUserStore = create<UserState>((set, get) => ({
  users: [],
  currentUserId: null,

  register: (username, password) => {
    const normalized = username.trim();
    if (!normalized) throw new Error("Username is required");

    const exists = get().users.some(u => u.username === normalized);
    if (exists) throw new Error("User already exists");

    const newUser: User = {
      id: normalized,
      username: normalized,
      passwordHash: hash(password),
    };
    set(state => ({ users: [...state.users, newUser] }));
  },

  login: (username, password) => {
    const user = get().users.find(u => u.username === username);
    if (!user) throw new Error("User not found");
    if (user.passwordHash !== hash(password)) throw new Error("Invalid credentials");

    set({ currentUserId: user.id });
  },

  logout: () => set({ currentUserId: null }),

  getCurrentUser: () => {
    const id = get().currentUserId;
    if (!id) return null;
    return get().users.find(u => u.id === id) ?? null;
  },
}));