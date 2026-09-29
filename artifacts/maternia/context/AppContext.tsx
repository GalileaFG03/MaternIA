import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearStorage, readJson, storageKeys, writeJson } from '@/services/storage';

export type User = { name: string; email: string };
export type Stage = 'embarazo' | 'posparto';
export type CheckIn = { date: string; mood: number; note: string };
export type ScoreRecord = { score: number; date: string };
export type Appointment = { id: string; date: string; time: string; pro: string; type: string; notes: string };
export type Post = { id: string; author: string; text: string; date: string; likes: number };

type AppContextValue = {
  user: User | null;
  stage: Stage | null;
  hydrated: boolean;
  setUser: (user: User) => Promise<void>;
  setStage: (stage: Stage) => Promise<void>;
  logout: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [stage, setStageState] = useState<Stage | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    Promise.all([
      readJson<User | null>(storageKeys.user, null),
      readJson<Stage | null>(storageKeys.stage, null),
    ]).then(([savedUser, savedStage]) => {
      setUserState(savedUser);
      setStageState(savedStage);
      setHydrated(true);
    });
  }, []);

  const value = useMemo<AppContextValue>(() => ({
    user,
    stage,
    hydrated,
    setUser: async (nextUser) => {
      setUserState(nextUser);
      await writeJson(storageKeys.user, nextUser);
    },
    setStage: async (nextStage) => {
      setStageState(nextStage);
      await writeJson(storageKeys.stage, nextStage);
    },
    logout: async () => {
      await clearStorage();
      setUserState(null);
      setStageState(null);
    },
  }), [user, stage, hydrated]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe usarse dentro de AppProvider');
  return context;
}
