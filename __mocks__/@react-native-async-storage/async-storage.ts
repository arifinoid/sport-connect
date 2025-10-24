const mem = new Map<string, string>();

const AsyncStorage = {
  async getItem(key: string) {
    return mem.get(key) ?? null;
  },
  async setItem(key: string, value: string) {
    mem.set(key, value);
  },
  async removeItem(key: string) {
    mem.delete(key);
  },
  async clear() {
    mem.clear();
  },
};

export default AsyncStorage;
