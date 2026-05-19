import type { ApiOk } from './types';
import { apiClient } from './client';

export type TripSuggestion = {
  title: string;
  description: string;
  duration: string;
};

export type TripPlanResponse = {
  query: string;
  location: string;
  suggestions: TripSuggestion[];
  note: string;
};

export async function planTrip(query: string, location?: string): Promise<TripPlanResponse> {
  const res = await apiClient.post<ApiOk<TripPlanResponse>>('/ai/trip-plan', { query, location });
  return res.data.data;
}
