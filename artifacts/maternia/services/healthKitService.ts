export type HeartRateSummary = {
  samples: Array<{ value: number; date: string; source: string }>;
  average: number;
  min: number;
  max: number;
  lastMeasurement: { value: number; date: string; source: string };
};

// This boundary is intentionally native-free so Expo Go can run the app.
// In a future Development Build, uncomment the HealthKit import and replace
// the stubs with read-only authorization for HeartRate, SleepAnalysis and StepCount.
export class HealthKitService {
  async isAvailable(): Promise<boolean> {
    return false;
  }

  async requestAuthorization(): Promise<boolean> {
    return false;
  }

  async fetchHeartRate(_startDate: Date, _endDate: Date): Promise<HeartRateSummary | null> {
    return null;
  }

  async fetchSleep(_startDate: Date, _endDate: Date): Promise<{ hours: number; minutes: number; samples: unknown[] } | null> {
    return null;
  }

  async fetchStepCount(_startDate: Date, _endDate: Date): Promise<number | null> {
    return null;
  }
}

export const healthKitService = new HealthKitService();
