import type { ApiOk, PlaceDetail, PlaceListItem } from './types';
import { apiClient } from './client';

const placeDetailCache = new Map<string, PlaceDetail>();
const placeDetailRequests = new Map<string, Promise<PlaceDetail>>();

const categoryQuery: Record<string, string> = {
  Attractions: 'attractions',
  Dining: 'dining',
  Festivals: 'festivals',
};

export async function fetchPlaces(category: string): Promise<PlaceListItem[]> {
  const q = categoryQuery[category] ?? 'attractions';
  const res = await apiClient.get<ApiOk<PlaceListItem[]>>('/places', {
    params: { category: q, limit: 50 },
  });
  return res.data.data;
}

export async function fetchPlaceDetail(placeId: string): Promise<PlaceDetail> {
  const cached = placeDetailCache.get(placeId);
  if (cached) {
    return cached;
  }

  const pending = placeDetailRequests.get(placeId);
  if (pending) {
    return pending;
  }

  const request = apiClient.get<ApiOk<PlaceDetail>>(`/places/${placeId}`).then((res) => {
    placeDetailCache.set(placeId, res.data.data);
    return res.data.data;
  }).finally(() => {
    placeDetailRequests.delete(placeId);
  });

  placeDetailRequests.set(placeId, request);
  return request;
}

export async function refreshPlaceDetail(placeId: string): Promise<PlaceDetail> {
  const res = await apiClient.get<ApiOk<PlaceDetail>>(`/places/${placeId}`);
  placeDetailCache.set(placeId, res.data.data);
  return res.data.data;
}

export function getCachedPlaceDetail(placeId: string): PlaceDetail | undefined {
  return placeDetailCache.get(placeId);
}

export function clearPlaceDetailCache(placeId?: string) {
  if (placeId) {
    placeDetailCache.delete(placeId);
    return;
  }

  placeDetailCache.clear();
}
