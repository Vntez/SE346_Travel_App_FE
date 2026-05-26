import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showAppAlert, showErrorAlert, showSuccessAlert } from '@/components/app-alert';
import { getCachedPlaceDetail, refreshPlaceDetail } from '../../../lib/api/places';
import { createReview, getCachedPlaceReviews, refreshPlaceReviews, toggleReviewLike } from '../../../lib/api/reviews';
import { uploadReviewImage } from '../../../lib/api/uploads';
import type { ReviewListItem } from '../../../lib/api/types';
import { getApiErrorMessage } from '../context/AuthContext';
import { RatingStartBar } from '../components/Rating';
import styles from './ViewReviewsScreen.styles';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80';

const formatRatingCount = (value = 0) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return String(value);
};

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 'U';
  const first = words[0]?.charAt(0) ?? '';
  const last = words.length > 1 ? words[words.length - 1]?.charAt(0) : words[0]?.charAt(1) ?? '';
  return `${first}${last}`.toUpperCase();
}

function ReviewAvatar({ uri, name }: { uri?: string; name: string }) {
  if (uri) {
    return <Image source={{ uri }} style={styles.reviewAvatar} />;
  }

  return (
    <View style={styles.reviewAvatarFallback}>
      <Text style={styles.reviewAvatarText}>{getInitials(name)}</Text>
    </View>
  );
}

function RatingDistribution({ reviews }: { reviews: ReviewListItem[] }) {
  const stats = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach((review) => {
      const rounded = Math.max(1, Math.min(5, Math.round(Number(review.Rate || 0))));
      counts[rounded] += 1;
    });

    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      percentage: reviews.length ? Math.round((counts[stars] / reviews.length) * 100) : 0,
    }));
  }, [reviews]);

  return (
    <View style={styles.ratingBars}>
      {stats.map((item) => (
        <View key={item.stars} style={styles.ratingBarRow}>
          <Text style={styles.ratingBarStar}>{item.stars}</Text>
          <View style={styles.ratingBarTrack}>
            <View style={[styles.ratingBarFill, { width: `${item.percentage}%` }]} />
          </View>
          <Text style={styles.ratingBarPercent}>{item.percentage}%</Text>
        </View>
      ))}
    </View>
  );
}

function ReviewItem({
  item,
  onLikeToggle,
  onReport,
}: {
  item: ReviewListItem;
  onLikeToggle: (id: string) => void;
  onReport: () => void;
}) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <ReviewAvatar uri={item.avatar} name={item.username} />

        <View style={styles.reviewTitleBlock}>
          <Text style={styles.reviewName} numberOfLines={1}>
            {item.username || 'Người dùng'}
          </Text>
          <View style={styles.reviewStarsRow}>
            <RatingStartBar ratingValue={item.Rate} size={17} />
            <Text style={styles.reviewDate}>{item.date}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.reviewContent}>{item.content}</Text>

      {item.images?.length ? (
        <FlatList
          horizontal
          data={item.images}
          keyExtractor={(uri, index) => `${item.id}-${uri}-${index}`}
          renderItem={({ item: uri }) => <Image source={{ uri }} style={styles.reviewImage} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reviewImages}
        />
      ) : null}

      <View style={styles.reviewActions}>
        <Pressable style={styles.reviewActionButton} onPress={() => onLikeToggle(item.id)}>
          <Ionicons name="thumbs-up-outline" size={18} color="#0284C7" />
          <Text style={styles.likeText}>{item.likes}</Text>
        </Pressable>

        <Pressable style={styles.reviewActionButton} onPress={onReport}>
          <Ionicons name="flag-outline" size={18} color="#64748B" />
          <Text style={styles.reportText}>Báo cáo</Text>
        </Pressable>
      </View>
    </View>
  );
}

function RatingPicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <View style={styles.ratingPicker}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable key={star} onPress={() => onChange(star)} hitSlop={8}>
          <Ionicons
            name={star <= value ? 'star' : 'star-outline'}
            size={22}
            color="#F59E0B"
          />
        </Pressable>
      ))}
    </View>
  );
}

export default function ViewReviewsScreen({ navigation, route }: any) {
  const placeId = route.params?.placeId as string | undefined;
  const cachedPlace = placeId ? getCachedPlaceDetail(placeId) : undefined;
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [reviews, setReviews] = useState<ReviewListItem[]>(placeId ? getCachedPlaceReviews(placeId) ?? [] : []);
  const [placeRate, setPlaceRate] = useState(Number(route.params?.placeRate ?? cachedPlace?.Rate ?? 0));
  const [placeCount, setPlaceCount] = useState(Number(route.params?.placeCount ?? cachedPlace?.NumberOfRate ?? 0));
  const [placeName, setPlaceName] = useState(route.params?.placeName ?? cachedPlace?.Name ?? 'Đánh giá');
  const [coverImage, setCoverImage] = useState(route.params?.coverImage ?? cachedPlace?.Image ?? FALLBACK_IMAGE);
  const [loading, setLoading] = useState(!reviews.length);
  const [submitting, setSubmitting] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    if (!placeId) return;

    setLoading(true);
    try {
      const [place, list] = await Promise.all([
        refreshPlaceDetail(placeId),
        refreshPlaceReviews(placeId),
      ]);

      setPlaceName(place.Name);
      setPlaceRate(Number(place.Rate || 0));
      setPlaceCount(Number(place.NumberOfRate || list.length));
      setCoverImage(place.Image || FALLBACK_IMAGE);
      setReviews(list);
    } catch (err) {
      showErrorAlert(getApiErrorMessage(err), 'Không tải được đánh giá');
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLikeToggle = async (reviewId: string) => {
    const current = reviews.find((review) => review.id === reviewId);
    if (!current) return;

    setReviews((prev) =>
      prev.map((review) => review.id === reviewId ? { ...review, likes: review.likes + 1 } : review)
    );

    try {
      const result = await toggleReviewLike(reviewId);
      setReviews((prev) =>
        prev.map((review) => review.id === reviewId ? { ...review, likes: result.likes } : review)
      );
    } catch (err) {
      setReviews((prev) =>
        prev.map((review) => review.id === reviewId ? { ...review, likes: current.likes } : review)
      );
      showErrorAlert(getApiErrorMessage(err));
    }
  };

  const handlePickImage = async () => {
    if (pendingImages.length >= 5) {
      showErrorAlert('Bạn chỉ có thể thêm tối đa 5 ảnh.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showErrorAlert('Cần quyền truy cập thư viện ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 5 - pendingImages.length,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri).slice(0, 5 - pendingImages.length);
      setPendingImages((prev) => [...prev, ...uris].slice(0, 5));
    }
  };

  const handleSubmitReview = async () => {
    if (!placeId) return;

    const content = reviewText.trim();
    if (!content) {
      showErrorAlert('Vui lòng nhập nội dung đánh giá.');
      return;
    }

    setSubmitting(true);
    try {
      const imageUrls: string[] = [];
      for (const uri of pendingImages) {
        try {
          const url = await uploadReviewImage(uri);
          imageUrls.push(url);
        } catch (err) {
          const msg = getApiErrorMessage(err);
          if (msg === 'STORAGE_UNAVAILABLE') {
            showAppAlert({
              title: 'Upload ảnh chưa sẵn sàng',
              message: 'Máy chủ chưa cấu hình lưu trữ ảnh. Đánh giá sẽ được gửi không kèm ảnh.',
              type: 'warning',
            });
          }
        }
      }

      await createReview(placeId, {
        rating: userRating,
        content,
        imageUrls: imageUrls.length ? imageUrls : undefined,
      });

      setReviewText('');
      setPendingImages([]);
      showSuccessAlert('Đánh giá của bạn đã được gửi.');
      await loadData();
    } catch (err) {
      showErrorAlert(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = () => {
    showAppAlert({
      title: 'Báo cáo đánh giá',
      message: 'Cảm ơn bạn. Tính năng gửi báo cáo chi tiết sẽ được bổ sung trong phiên bản tiếp theo.',
      type: 'info',
    });
  };

  const renderHeader = () => (
    <View>
      <ImageBackground source={{ uri: coverImage }} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroOverlay} />
        <SafeAreaView edges={['top']} style={styles.heroSafeArea}>
          <View style={styles.heroTopBar}>
            <Pressable style={styles.roundButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={23} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>Đánh giá địa điểm</Text>
            <Text style={styles.placeName} numberOfLines={2}>
              {placeName}
            </Text>

            <View style={styles.scoreRow}>
              <Text style={styles.scoreValue}>{placeRate.toFixed(1)}</Text>
              <View>
                <RatingStartBar ratingValue={placeRate} size={24} />
                <Text style={styles.scoreSubtitle}>
                  {formatRatingCount(placeCount || reviews.length)} đánh giá đã xác thực
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.summaryTitle}>Tổng quan đánh giá</Text>
            <Text style={styles.summarySubtitle}>Phân bố theo số sao từ cộng đồng</Text>
          </View>
          {loading ? <ActivityIndicator size="small" color="#0284C7" /> : null}
        </View>
        <RatingDistribution reviews={reviews} />
      </View>
    </View>
  );

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

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <ReviewItem item={item} onLikeToggle={handleLikeToggle} onReport={handleReport} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={loadData}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.reviewGap} />}
        ListEmptyComponent={
          <View style={styles.emptyReviews}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color="#0284C7" />
                <Text style={styles.emptyTitle}>Đang tải đánh giá...</Text>
              </>
            ) : (
              <>
                <View style={styles.emptyIcon}>
                  <Ionicons name="chatbubbles-outline" size={30} color="#0284C7" />
                </View>
                <Text style={styles.emptyTitle}>Chưa có đánh giá</Text>
                <Text style={styles.emptyText}>Hãy là người đầu tiên chia sẻ trải nghiệm tại địa điểm này.</Text>
              </>
            )}
          </View>
        }
      />

      {pendingImages.length > 0 ? (
        <View style={styles.pendingImagesBar}>
          {pendingImages.map((uri, index) => (
            <View key={`${uri}-${index}`} style={styles.pendingImageWrap}>
              <Image source={{ uri }} style={styles.pendingImage} />
              <Pressable
                style={styles.removeImageButton}
                onPress={() => setPendingImages((prev) => prev.filter((_, itemIndex) => itemIndex !== index))}
              >
                <Ionicons name="close" size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.inputBar}>
        <Pressable style={styles.photoButton} onPress={handlePickImage}>
          <Ionicons name="camera-outline" size={22} color="#0284C7" />
        </Pressable>

        <View style={styles.inputContent}>
          <RatingPicker value={userRating} onChange={setUserRating} />
          <TextInput
            style={styles.textInput}
            placeholder="Chia sẻ trải nghiệm của bạn..."
            placeholderTextColor="#94A3B8"
            value={reviewText}
            onChangeText={setReviewText}
            multiline
          />
        </View>

        <Pressable
          style={[
            styles.sendButton,
            (!reviewText.trim() || submitting) && styles.sendButtonDisabled,
          ]}
          disabled={!reviewText.trim() || submitting}
          onPress={handleSubmitReview}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Ionicons name={'send' as IconName} size={19} color="#FFFFFF" />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
