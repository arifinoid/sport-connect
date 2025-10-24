import { create } from "zustand";
import type { Event, JoinStatus } from "@/types/model.type";
import { createUserStore } from "./user.store";
import { storage } from "@/utils/storage";

type CreateEventInput = { title: string; sport: string; startTime: string; limit: number };

type EventState = {
    events: Event[];

    createEvent: (input: CreateEventInput) => void;
    requestJoin: (eventId: string, userId: string) => void;
    cancelJoinRequest: (eventId: string, userId: string, nowISO?: string) => void;
    acceptRequest: (eventId: string, userId: string, actingUserId: string) => void;
    rejectRequest: (eventId: string, userId: string, actingUserId: string) => void;
    expirePendingRequests: (nowISO?: string) => void;

    getUpcomingEvents: () => Event[];
    getJoinStatus: (eventId: string, userId: string) => JoinStatus;

    // persistence
    hydrate: () => Promise<void>;
    save: () => Promise<void>;
};

const KEY = "sc:event:v1";
const isoNow = () => new Date().toISOString();
const isAfter = (a: string, b: string) => new Date(a).getTime() > new Date(b).getTime();
const isAfterOrEqual = (a: string, b: string) => new Date(a).getTime() >= new Date(b).getTime();

export const createEventStore = create<EventState>((set, get) => ({
    events: [],

    createEvent: (input) => {
        const organizer = createUserStore.getState().getCurrentUser();
        if (!organizer) throw new Error("Must be logged in to create event");
        const id = `${organizer.id}-${Date.now()}`;
        const ev: Event = {
            id,
            title: input.title.trim(),
            sport: input.sport.trim(),
            startTime: input.startTime,
            limit: Math.max(1, input.limit),
            organizerId: organizer.id,
            participants: [],
            pendingRequests: [],
        };
        set(s => ({ events: [...s.events, ev] }));
        void get().save();
    },

    requestJoin: (eventId, userId) => {
        set(s => ({
            events: s.events.map(e =>
                e.id === eventId &&
                    !e.participants.includes(userId) &&
                    !e.pendingRequests.includes(userId)
                    ? { ...e, pendingRequests: [...e.pendingRequests, userId] }
                    : e
            ),
        }));
        void get().save();
    },

    cancelJoinRequest: (eventId, userId, nowISO) => {
        const now = nowISO ?? isoNow();
        set(s => ({
            events: s.events.map(e => {
                if (e.id !== eventId) return e;
                if (!isAfter(e.startTime, now)) return e;
                return { ...e, pendingRequests: e.pendingRequests.filter(u => u !== userId) };
            }),
        }));
        void get().save();
    },

    acceptRequest: (eventId, userId, actingUserId) => {
        set(s => ({
            events: s.events.map(e => {
                if (e.id !== eventId) return e;
                if (e.organizerId !== actingUserId) throw new Error("Only organizer can accept");
                if (e.participants.length >= e.limit) throw new Error("Player limit reached");
                return {
                    ...e,
                    participants: [...e.participants, userId],
                    pendingRequests: e.pendingRequests.filter(u => u !== userId),
                };
            }),
        }));
        void get().save();
    },

    rejectRequest: (eventId, userId, actingUserId) => {
        set(s => ({
            events: s.events.map(e => {
                if (e.id !== eventId) return e;
                if (e.organizerId !== actingUserId) throw new Error("Only organizer can reject");
                return { ...e, pendingRequests: e.pendingRequests.filter(u => u !== userId) };
            }),
        }));
        void get().save();
    },

    expirePendingRequests: (nowISO) => {
        const now = nowISO ?? isoNow();
        set(s => ({
            events: s.events.map(e =>
                isAfterOrEqual(now, e.startTime) && e.pendingRequests.length
                    ? { ...e, pendingRequests: [] }
                    : e
            ),
        }));
        void get().save();
    },

    getUpcomingEvents: () => {
        const now = isoNow();
        return [...get().events]
            .filter(e => isAfter(e.startTime, now))
            .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime));
    },

    getJoinStatus: (eventId, userId) => {
        const e = get().events.find(e => e.id === eventId);
        if (!e || !userId) return "none";
        if (e.participants.includes(userId)) return "joined";
        if (e.pendingRequests.includes(userId)) return "pending";
        return "none";
    },

    hydrate: async () => {
        const raw: string | null = await storage.getJSON(KEY);
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw) as Pick<EventState, "events">;
            set({ events: parsed.events ?? [] });
        } catch { }
    },

    save: async () => {
        const snapshot: Pick<EventState, "events"> = { events: get().events };
        await storage.setJSON(KEY, JSON.stringify(snapshot));
    },
}));

