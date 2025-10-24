import { createUserStore } from '@/stores/user.store';
import { createEventStore } from '@/stores/event.store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const resetStores = async () => {
  await (AsyncStorage as any).clear?.();
  createUserStore.setState({ users: [], currentUserId: null } as any, true);
  createEventStore.setState({ events: [] } as any, true);
};
