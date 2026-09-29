import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  user: '@maternia_user',
  stage: '@maternia_stage',
  checkins: '@maternia_checkins',
  phq9: '@maternia_phq9',
  epds: '@maternia_epds',
  appointments: '@maternia_appointments',
  posts: '@maternia_posts',
  health: '@maternia_health',
} as const;

export async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function clearStorage(): Promise<void> {
  await AsyncStorage.clear();
}
