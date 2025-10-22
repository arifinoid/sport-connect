import { createUserStore } from "@/stores/user.store";
import { createEventStore } from "@/stores/event.store";

const inHours = (h: number) => new Date(Date.now() + h * 3600_000).toISOString();
const agoHours = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

describe("event-store", () => {
  beforeEach(() => {
    createUserStore.setState({ users: [], currentUserId: null });
    createEventStore.setState({ events: [] });
  });

  test("create event assigns organizer and sorts upcoming events by start time", () => {
    const users = createUserStore.getState();
    users.register("org", "pw");
    users.login("org", "pw");
    const org = users.getCurrentUser()!;
    const eventsApi = createEventStore.getState();

    eventsApi.createEvent({ title: "Basketball", sport: "basketball", startTime: inHours(3), limit: 5 });
    eventsApi.createEvent({ title: "Tennis", sport: "tennis", startTime: inHours(1), limit: 2 });

    const upcoming = createEventStore.getState().getUpcomingEvents();
    expect(upcoming.map(e => e.title)).toEqual(["Tennis", "Basketball"]);
    expect(upcoming[0].organizerId).toBe(org.id);
  });

  test("user can request join, organizer can accept/reject; capacity enforced", () => {
    const users = createUserStore.getState();
    users.register("org", "pw");
    users.login("org", "pw");
    const org = users.getCurrentUser()!;

    users.register("u1", "pw");
    users.register("u2", "pw");
    users.register("u3", "pw");

    const events = createEventStore.getState();
    events.createEvent({ title: "Tennis", sport: "tennis", startTime: inHours(2), limit: 2 });
    const event = createEventStore.getState().events[0];

    events.requestJoin(event.id, "u1");
    events.requestJoin(event.id, "u2");
    events.requestJoin(event.id, "u3");

    events.acceptRequest(event.id, "u1", org.id);
    events.acceptRequest(event.id, "u2", org.id);

    expect(() => events.acceptRequest(event.id, "u3", org.id)).toThrow(/limit/i);
    events.rejectRequest(event.id, "u3", org.id);

    const refreshed = createEventStore.getState().events[0];
    expect(refreshed.participants).toEqual(["u1", "u2"]);
    expect(refreshed.pendingRequests).toEqual([]);
  });

  test("non-organizer cannot accept/reject", () => {
    const users = createUserStore.getState();
    users.register("org", "pw");
    users.register("alice", "pw");
    users.login("org", "pw");
    const org = users.getCurrentUser()!;

    const events = createEventStore.getState();
    events.createEvent({ title: "Soccer", sport: "soccer", startTime: inHours(2), limit: 10 });
    const ev = createEventStore.getState().events[0];

    events.requestJoin(ev.id, "alice");
    expect(() => events.acceptRequest(ev.id, "alice", "alice")).toThrow(/organizer/i);
    events.acceptRequest(ev.id, "alice", org.id);
    expect(createEventStore.getState().events[0].participants).toContain("alice");
  });

  test("user can cancel join request before start; after start it is expired", () => {
    const users = createUserStore.getState();
    users.register("org", "pw");
    users.login("org", "pw");

    const events = createEventStore.getState();
    events.createEvent({ title: "Volleyball", sport: "volleyball", startTime: inHours(1), limit: 6 });
    const evId = createEventStore.getState().events[0].id;

    users.register("bob", "pw");
    events.requestJoin(evId, "bob");
    events.cancelJoinRequest(evId, "bob", new Date().toISOString());
    expect(createEventStore.getState().events[0].pendingRequests).toEqual([]);

    events.requestJoin(evId, "bob");
    events.expirePendingRequests(new Date(Date.now() + 3600_000).toISOString());
    expect(createEventStore.getState().events[0].pendingRequests).toEqual([]);
  });

  test("past events are not included in upcoming list", () => {
    const users = createUserStore.getState();
    users.register("org", "pw");
    users.login("org", "pw");

    const events = createEventStore.getState();
    events.createEvent({ title: "Old", sport: "any", startTime: agoHours(2), limit: 2 });
    events.createEvent({ title: "Future", sport: "any", startTime: inHours(2), limit: 2 });

    const upcoming = createEventStore.getState().getUpcomingEvents();
    expect(upcoming.map(e => e.title)).toEqual(["Future"]);
  });
});
