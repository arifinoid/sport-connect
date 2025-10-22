import { create } from "zustand";
import type { Event, JoinStatus } from "@/types/model.type";
import { createUserStore } from "@/stores/user.store";

type CreateEventInput = {
  title: string;
  sport: string;
  startTime: string; // ISO
  limit: number;
};

type EventState = {
  events: Event[];

  createEvent: (input: CreateEventInput) => void;
  requestJoin: (eventId: string, userId: string) => void;
  cancelJoinRequest: (eventId: string, userId: string, nowISO?: string) => void;
  acceptRequest: (eventId: string, userId: string, actingUserId: string) => void;
  rejectRequest: (eventId: string, userId: string, actingUserId: string) => void;
  expirePendingRequests: (nowISO?: string) => void;

  getUpcomingEvents: () => Event[];
  getParticipants: (eventId: string) => string[];
  getJoinStatus: (eventId: string, userId: string) => JoinStatus;
};

const isoNow = () => new Date().toISOString();
const isAfterOrEqual = (aISO: string, bISO: string) => new Date(aISO).getTime() >= new Date(bISO).getTime();
const isAfter = (aISO: string, bISO: string) => new Date(aISO).getTime() > new Date(bISO).getTime();

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
    set(state => ({ events: [...state.events, ev] }));
  },

  requestJoin: (eventId, userId) => {
    set(state => {
      const events = state.events.map(ev => {
        if (ev.id !== eventId) return ev;

        // already joined
        if (ev.participants.includes(userId)) return ev;
        // already pending
        if (ev.pendingRequests.includes(userId)) return ev;

        // Join requests are allowed regardless of capacity; capacity checked on accept
        return { ...ev, pendingRequests: [...ev.pendingRequests, userId] };
      });
      return { events };
    });
  },

  cancelJoinRequest: (eventId, userId, nowISO) => {
    const now = nowISO ?? isoNow();
    set(state => {
      const events = state.events.map(ev => {
        if (ev.id !== eventId) return ev;
        // can cancel only before event start
        if (!isAfter(ev.startTime, now)) return ev;
        if (!ev.pendingRequests.includes(userId)) return ev;
        return { ...ev, pendingRequests: ev.pendingRequests.filter(u => u !== userId) };
      });
      return { events };
    });
  },

  acceptRequest: (eventId, userId, actingUserId) => {
    set(state => {
      const events = state.events.map(ev => {
        if (ev.id !== eventId) return ev;
        if (ev.organizerId !== actingUserId) throw new Error("Only organizer can accept requests");
        if (!ev.pendingRequests.includes(userId)) return ev;

        if (ev.participants.length >= ev.limit) throw new Error("Player limit reached");
        return {
          ...ev,
          participants: [...ev.participants, userId],
          pendingRequests: ev.pendingRequests.filter(u => u !== userId),
        };
      });
      return { events };
    });
  },

  rejectRequest: (eventId, userId, actingUserId) => {
    set(state => {
      const events = state.events.map(ev => {
        if (ev.id !== eventId) return ev;
        if (ev.organizerId !== actingUserId) throw new Error("Only organizer can reject requests");
        if (!ev.pendingRequests.includes(userId)) return ev;
        return { ...ev, pendingRequests: ev.pendingRequests.filter(u => u !== userId) };
      });
      return { events };
    });
  },

  expirePendingRequests: (nowISO) => {
    const now = nowISO ?? isoNow();
    set(state => {
      const events = state.events.map(ev => {
        if (isAfterOrEqual(now, ev.startTime) && ev.pendingRequests.length > 0) {
          return { ...ev, pendingRequests: [] };
        }
        return ev;
      });
      return { events };
    });
  },

  getUpcomingEvents: () => {
    const now = isoNow();
    return [...get().events]
      .filter(e => isAfter(e.startTime, now))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  },

  getParticipants: (eventId) => {
    const ev = get().events.find(e => e.id === eventId);
    return ev ? [...ev.participants] : [];
  },

  getJoinStatus: (eventId, userId) => {
    const ev = get().events.find(e => e.id === eventId);
    if (!ev) return "none";
    if (ev.participants.includes(userId)) return "joined";
    if (ev.pendingRequests.includes(userId)) return "pending";
    return "none";
  },
}));
