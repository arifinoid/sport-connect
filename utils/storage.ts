import AsyncStorage from "@react-native-async-storage/async-storage";

type Storage = {
    getJSON<T>(key: string): Promise<T | null>;
    setJSON<T>(key: string, value: T): Promise<void>;
    remove(key: string): Promise<void>;
};

export const storage: Storage = {
    async getJSON<T>(key: string) {
        try {
            const raw = await AsyncStorage.getItem(key);
            return raw ? (JSON.parse(raw) as T) : null;
        } catch (_) {
            return null;
        }
    },

    async setJSON<T>(key: string, value: T) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (_) {

        }
    },

    async remove(key: string) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (_) {

        }
    },
};

