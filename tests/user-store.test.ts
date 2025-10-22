import { createUserStore } from "@/stores/user.store";

describe("user-store", () => {
  test("registers a new user and logs in", () => {
    const store = createUserStore.getState();
    store.register("alex", "secret123");

    // cannot re-register same username
    expect(() => store.register("alex", "other")).toThrow(/exists/i);

    store.login("alex", "secret123");
    const current = createUserStore.getState().getCurrentUser();
    expect(current?.username).toBe("alex");

    store.logout();
    expect(createUserStore.getState().getCurrentUser()).toBeNull();
  });

  test("rejects invalid login", () => {
    const store = createUserStore.getState();
    store.register("maria", "s3cr3t");
    expect(() => store.login("maria", "wrong")).toThrow(/invalid/i);
    expect(() => store.login("ghost", "s3cr3t")).toThrow(/not found/i);
  });
});
