import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showErrorAlert } from '@/components/app-alert';
import { addFavorite, removeFavorite } from '../../../lib/api/favorites';
import { getCachedPlaceDetail, refreshPlaceDetail } from '../../../lib/api/places';
import type { PlaceDetail, PlaceReview } from '../../../lib/api/types';
import { getApiErrorMessage } from '../context/AuthContext';
import { RatingStartBar } from '../components/Rating';
import styles from './DetailLocationScreen.styles';

type PlacePreview = {
    Id: string;
    Name: string;
    Location: string;
    Rate: number;
    NumberOfRate: number;
    Image: string;
    Features: string;
};

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80';

const featureLabels: Record<string, string> = {
    'Quiet Now': 'Yên tĩnh',
    'Open Now': 'Đang mở cửa',
    Popular: 'Được yêu thích',
    Outdoor: 'Ngoài trời',
    Indoor: 'Trong nhà',
    Romantic: 'Lãng mạn',
    'Family Friendly': 'Phù hợp gia đình',
};

const getFeatureLabel = (value?: string) => {
    const normalized = value?.trim();
    if (!normalized) {
        return 'Nổi bật';
    }
    return featureLabels[normalized] ?? normalized;
};

const formatRatingCount = (value = 0) => {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
    }
    return String(value);
};

const priceLabel = (level?: number | null) => {
    if (level == null) {
        return 'Chưa có';
    }

    if (level <= 1) return 'Tiết kiệm';
    if (level === 2) return 'Vừa phải';
    if (level === 3) return 'Cao cấp';
    return 'Sang trọng';
};

function ReviewPreviewCard({ review }: { review: PlaceReview }) {
    const avatar = review.ava || FALLBACK_IMAGE;

    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <Image source={{ uri: avatar }} style={styles.reviewAvatar} />
                <View style={styles.reviewAuthorBlock}>
                    <Text style={styles.reviewAuthor} numberOfLines={1}>
                        {review.Name}
                    </Text>
                    <View style={styles.reviewMetaRow}>
                        <RatingStartBar ratingValue={review.Rate} size={16} />
                        <Text style={styles.reviewDate}>{review.Date}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.reviewContent} numberOfLines={4}>
                {review.Content}
            </Text>

            {review.Pictures?.length ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.reviewImageRow}
                >
                    {review.Pictures.slice(0, 4).map((uri, index) => (
                        <Image key={`${uri}-${index}`} source={{ uri }} style={styles.reviewImage} />
                    ))}
                </ScrollView>
            ) : null}
        </View>
    );
}

export default function DetailLocationScreen({ navigation, route }: any) {
    const placeId = route.params?.placeId as string | undefined;
    const preview = route.params?.placePreview as PlacePreview | undefined;
    const cachedPlace = placeId ? getCachedPlaceDetail(placeId) : undefined;
    const [place, setPlace] = useState<PlaceDetail | null>(cachedPlace ?? null);
    const [loading, setLoading] = useState(!cachedPlace);
    const [favoriteBusy, setFavoriteBusy] = useState(false);
    const [isLiked, setIsLiked] = useState(Boolean(cachedPlace?.isFavorite));

    const viewData = useMemo(() => {
        return {
            id: place?.Id ?? preview?.Id ?? placeId ?? '',
            name: place?.Name ?? preview?.Name ?? 'Địa điểm',
            location: place?.Location ?? preview?.Location ?? 'Đang cập nhật vị trí',
            rating: Number(place?.Rate ?? preview?.Rate ?? 0),
            ratingCount: Number(place?.NumberOfRate ?? preview?.NumberOfRate ?? 0),
            image: place?.Image ?? preview?.Image ?? FALLBACK_IMAGE,
            feature: getFeatureLabel(place?.Features ?? preview?.Features),
            about: place?.about,
            priceLevel: place?.priceLevel,
            reviews: place?.Reviews ?? [],
        };
    }, [place, placeId, preview]);

    const isInitialLoading = loading && !place && !preview;

    const loadPlace = useCallback(async () => {
        if (!placeId) return;

        setLoading(true);
        try {
            const data = await refreshPlaceDetail(placeId);
            setPlace(data);
            setIsLiked(Boolean(data.isFavorite));
        } catch (err) {
            showErrorAlert(getApiErrorMessage(err), 'Không tải được địa điểm');
        } finally {
            setLoading(false);
        }
    }, [placeId]);

    useEffect(() => {
        loadPlace();
    }, [loadPlace]);

    const toggleFavorite = async () => {
        if (!placeId || favoriteBusy) return;

        const nextValue = !isLiked;
        setFavoriteBusy(true);
        setIsLiked(nextValue);

        try {
            if (nextValue) {
                await addFavorite(placeId);
            } else {
                await removeFavorite(placeId);
            }
        } catch (err) {
            setIsLiked(!nextValue);
            showErrorAlert(getApiErrorMessage(err), 'Không cập nhật được yêu thích');
        } finally {
            setFavoriteBusy(false);
        }
    };

    const openReviews = () => {
        navigation.navigate('All Reviews', {
            placeId: viewData.id,
            placeName: viewData.name,
            placeRate: viewData.rating,
            placeCount: viewData.ratingCount,
            coverImage: viewData.image,
        });
    };

    if (!placeId) {
        return (
            <SafeAreaView style={styles.centerScreen}>
                <Ionicons name="alert-circle-outline" size={42} color="#DC2626" />
                <Text style={styles.emptyTitle}>Thiếu thông tin địa điểm</Text>
                <Pressable style={styles.emptyButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.emptyButtonText}>Quay lại</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    if (isInitialLoading) {
        return (
            <SafeAreaView style={styles.centerScreen}>
                <ActivityIndicator size="large" color="#0284C7" />
                <Text style={styles.loadingText}>Đang mở địa điểm...</Text>
            </SafeAreaView>
        );
    }

    if (!viewData.id) {
        return (
            <SafeAreaView style={styles.centerScreen}>
                <Ionicons name="map-outline" size={42} color="#0284C7" />
                <Text style={styles.emptyTitle}>Không tìm thấy địa điểm</Text>
                <Pressable style={styles.emptyButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.emptyButtonText}>Quay lại</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    const firstReview = viewData.reviews[0];

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <ImageBackground source={{ uri: viewData.image }} style={styles.hero} imageStyle={styles.heroImage}>
                    <View style={styles.heroOverlay} />

                    <View style={styles.heroTopBar}>
                        <Pressable style={styles.roundButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="chevron-back" size={23} color="#FFFFFF" />
                        </Pressable>

                        <Pressable
                            style={[styles.roundButton, isLiked && styles.favoriteButtonActive]}
                            onPress={toggleFavorite}
                            disabled={favoriteBusy}
                        >
                            {favoriteBusy ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Ionicons
                                    name={isLiked ? 'heart' : 'heart-outline'}
                                    size={22}
                                    color={isLiked ? '#FFFFFF' : '#FFFFFF'}
                                />
                            )}
                        </Pressable>
                    </View>

                    <View style={styles.heroBottom}>
                        <View style={styles.featurePill}>
                            <Ionicons name="sparkles-outline" size={15} color="#0369A1" />
                            <Text style={styles.featurePillText}>{viewData.feature}</Text>
                        </View>

                        <Text style={styles.title} numberOfLines={2}>
                            {viewData.name}
                        </Text>

                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={18} color="#E0F2FE" />
                            <Text style={styles.locationText} numberOfLines={2}>
                                {viewData.location}
                            </Text>
                        </View>
                    </View>
                </ImageBackground>

                <View style={styles.contentCard}>
                    <View style={styles.quickStatsRow}>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, styles.ratingIcon]}>
                                <Ionicons name="star" size={18} color="#D97706" />
                            </View>
                            <Text style={styles.statValue}>{viewData.rating.toFixed(1)}</Text>
                            <Text style={styles.statLabel}>{formatRatingCount(viewData.ratingCount)} đánh giá</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, styles.priceIcon]}>
                                <Ionicons name="wallet-outline" size={18} color="#047857" />
                            </View>
                            <Text style={styles.statValue}>{priceLabel(viewData.priceLevel)}</Text>
                            <Text style={styles.statLabel}>Mức giá</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, styles.featureIcon]}>
                                <Ionicons name="people-outline" size={18} color="#0369A1" />
                            </View>
                            <Text style={styles.statValue} numberOfLines={1}>
                                {viewData.feature}
                            </Text>
                            <Text style={styles.statLabel}>Không khí</Text>
                        </View>
                    </View>

                    {loading ? (
                        <View style={styles.inlineLoading}>
                            <ActivityIndicator size="small" color="#0284C7" />
                            <Text style={styles.inlineLoadingText}>Đang cập nhật thông tin mới nhất</Text>
                        </View>
                    ) : null}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Giới thiệu</Text>
                        <Text style={styles.aboutText}>
                            {viewData.about || 'Địa điểm này chưa có mô tả chi tiết. Bạn có thể xem đánh giá để tham khảo trải nghiệm thực tế từ người dùng khác.'}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>Đánh giá nổi bật</Text>
                                <Text style={styles.sectionSubtitle}>
                                    {viewData.ratingCount ? `${formatRatingCount(viewData.ratingCount)} lượt đánh giá từ cộng đồng` : 'Chưa có đánh giá'}
                                </Text>
                            </View>

                            <Pressable style={styles.linkButton} onPress={openReviews}>
                                <Text style={styles.linkButtonText}>Xem tất cả</Text>
                                <Ionicons name="arrow-forward" size={16} color="#0284C7" />
                            </Pressable>
                        </View>

                        {firstReview ? (
                            <ReviewPreviewCard review={firstReview} />
                        ) : (
                            <View style={styles.noReviewCard}>
                                <View style={styles.noReviewIcon}>
                                    <Ionicons name="chatbubble-ellipses-outline" size={28} color="#0284C7" />
                                </View>
                                <Text style={styles.noReviewTitle}>Chưa có đánh giá</Text>
                                <Text style={styles.noReviewText}>Hãy là người đầu tiên chia sẻ trải nghiệm tại đây.</Text>
                                <Pressable style={styles.reviewAction} onPress={openReviews}>
                                    <Text style={styles.reviewActionText}>Viết đánh giá</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
