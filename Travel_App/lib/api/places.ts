import type { ApiOk, PlaceDetail, PlaceListItem } from './types';
import { apiClient } from './client';

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
  const res = await apiClient.get<ApiOk<PlaceDetail>>(`/places/${placeId}`);
  return res.data.data;
}
