import type { PromotionItem } from '../../app/(tabs)/types/promotion';
import type { ApiOk } from './types';
import { apiClient } from './client';

let ownerPlacesCache: OwnerPlace[] | null = null;
let ownerPlacesRequest: Promise<OwnerPlace[]> | null = null;
const ownerPromotionsCache = new Map<string, PromotionItem[]>();
const ownerPromotionsRequests = new Map<string, Promise<PromotionItem[]>>();

export type OwnerPlace = {
  Id: string;
  Name: string;
  Location: string;
  Image: string;
};

export type OwnerPlaceDetail = OwnerPlace & {
  category: string;
  about: string;
  featureLabel: string;
  priceLevel: number | null;
  latitude: number | null;
  longitude: number | null;
  promotions: PromotionItem[];
};

export async function fetchOwnerPlaces(): Promise<OwnerPlace[]> {
  if (ownerPlacesCache) {
    return ownerPlacesCache;
  }

  if (ownerPlacesRequest) {
    return ownerPlacesRequest;
  }

  ownerPlacesRequest = apiClient.get<ApiOk<OwnerPlace[]>>('/owner/places').then((res) => {
    ownerPlacesCache = res.data.data;
    return res.data.data;
  }).finally(() => {
    ownerPlacesRequest = null;
  });

  return ownerPlacesRequest;
}

export async function refreshOwnerPlaces(): Promise<OwnerPlace[]> {
  const res = await apiClient.get<ApiOk<OwnerPlace[]>>('/owner/places');
  ownerPlacesCache = res.data.data;
  return res.data.data;
}

export function getCachedOwnerPlaces(): OwnerPlace[] | null {
  return ownerPlacesCache;
}

export async function fetchOwnerPlace(placeId: string): Promise<OwnerPlaceDetail> {
  const res = await apiClient.get<ApiOk<OwnerPlaceDetail>>(`/owner/places/${placeId}`);
  return res.data.data;
}

export async function createOwnerPlace(body: {
  name: string;
  region: string;
  category: string;
  about: string;
  coverImageUrl: string;
  featureLabel?: string;
  promotions?: { title: string; isActive?: boolean; schedule: PromotionItem['schedule'] }[];
}): Promise<OwnerPlace> {
  const res = await apiClient.post<ApiOk<OwnerPlace>>('/owner/places', body);
  ownerPlacesCache = null;
  return res.data.data;
}

export async function updateOwnerPlace(
  placeId: string,
  body: Partial<{
    name: string;
    region: string;
    category: string;
    about: string;
    coverImageUrl: string;
    featureLabel: string;
  }>
): Promise<OwnerPlace> {
  const res = await apiClient.patch<ApiOk<OwnerPlace>>(`/owner/places/${placeId}`, body);
  ownerPlacesCache = null;
  return res.data.data;
}

export async function deleteOwnerPlace(placeId: string): Promise<void> {
  await apiClient.delete(`/owner/places/${placeId}`);
  ownerPlacesCache = null;
  ownerPromotionsCache.delete(placeId);
}

export async function fetchPlacePromotions(placeId: string): Promise<PromotionItem[]> {
  const cached = ownerPromotionsCache.get(placeId);
  if (cached) {
    return cached;
  }

  const pending = ownerPromotionsRequests.get(placeId);
  if (pending) {
    return pending;
  }

  const request = apiClient.get<ApiOk<PromotionItem[]>>(`/owner/places/${placeId}/promotions`).then((res) => {
    ownerPromotionsCache.set(placeId, res.data.data);
    return res.data.data;
  }).finally(() => {
    ownerPromotionsRequests.delete(placeId);
  });

  ownerPromotionsRequests.set(placeId, request);
  return request;
}

export async function refreshPlacePromotions(placeId: string): Promise<PromotionItem[]> {
  const res = await apiClient.get<ApiOk<PromotionItem[]>>(`/owner/places/${placeId}/promotions`);
  ownerPromotionsCache.set(placeId, res.data.data);
  return res.data.data;
}

export function getCachedPlacePromotions(placeId: string): PromotionItem[] | undefined {
  return ownerPromotionsCache.get(placeId);
}

export async function createPromotion(
  placeId: string,
  body: { title: string; isActive?: boolean; schedule: PromotionItem['schedule'] }
): Promise<PromotionItem> {
  const res = await apiClient.post<ApiOk<PromotionItem>>(`/owner/places/${placeId}/promotions`, body);
  ownerPromotionsCache.delete(placeId);
  return res.data.data;
}

export async function updatePromotion(
  promotionId: string,
  body: Partial<{ title: string; isActive: boolean; schedule: PromotionItem['schedule'] }>
): Promise<PromotionItem> {
  const res = await apiClient.patch<ApiOk<PromotionItem>>(`/owner/promotions/${promotionId}`, body);
  ownerPromotionsCache.clear();
  return res.data.data;
}

export async function togglePromotion(promotionId: string): Promise<PromotionItem> {
  const res = await apiClient.post<ApiOk<PromotionItem>>(`/owner/promotions/${promotionId}/toggle`);
  ownerPromotionsCache.clear();
  return res.data.data;
}

export async function deletePromotion(promotionId: string): Promise<void> {
  await apiClient.delete(`/owner/promotions/${promotionId}`);
  ownerPromotionsCache.clear();
}
