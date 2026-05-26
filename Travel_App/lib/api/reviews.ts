import type { ApiOk, ReviewListItem } from './types';
import { apiClient } from './client';

const reviewCache = new Map<string, ReviewListItem[]>();
const reviewRequests = new Map<string, Promise<ReviewListItem[]>>();

export async function fetchPlaceReviews(placeId: string): Promise<ReviewListItem[]> {
  const cached = reviewCache.get(placeId);
  if (cached) {
    return cached;
  }

  const pending = reviewRequests.get(placeId);
  if (pending) {
    return pending;
  }

  const request = apiClient.get<ApiOk<ReviewListItem[]>>(`/places/${placeId}/reviews`, {
    params: { limit: 50 },
  }).then((res) => {
    reviewCache.set(placeId, res.data.data);
    return res.data.data;
  }).finally(() => {
    reviewRequests.delete(placeId);
  });

  reviewRequests.set(placeId, request);
  return request;
}

export async function refreshPlaceReviews(placeId: string): Promise<ReviewListItem[]> {
  const res = await apiClient.get<ApiOk<ReviewListItem[]>>(`/places/${placeId}/reviews`, {
    params: { limit: 50 },
  });
  reviewCache.set(placeId, res.data.data);
  return res.data.data;
}

export async function createReview(
  placeId: string,
  body: { rating: number; content: string; imageUrls?: string[] }
): Promise<void> {
  await apiClient.post(`/places/${placeId}/reviews`, body);
  reviewCache.delete(placeId);
}

export async function toggleReviewLike(reviewId: string): Promise<{ liked: boolean; likes: number }> {
  const res = await apiClient.post<ApiOk<{ liked: boolean; likes: number }>>(
    `/reviews/${reviewId}/likes/toggle`
  );
  reviewCache.forEach((reviews, placeId) => {
    if (reviews.some((review) => review.id === reviewId)) {
      reviewCache.set(
        placeId,
        reviews.map((review) =>
          review.id === reviewId ? { ...review, likes: res.data.data.likes } : review
        )
      );
    }
  });
  return res.data.data;
}

export function getCachedPlaceReviews(placeId: string): ReviewListItem[] | undefined {
  return reviewCache.get(placeId);
}

export function clearPlaceReviewsCache(placeId?: string) {
  if (placeId) {
    reviewCache.delete(placeId);
    return;
  }

  reviewCache.clear();
}
