import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';
import Octicons from '@expo/vector-icons/Octicons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../common/colors';
import { calculateRatingStats, RatingBar, ratingBarStyles, RatingStartBar } from '../components/Rating';
import { PicturesContainer } from '../components/ReviewPicture';
import styles from './ViewReviewsScreen.styles';
import * as ImagePicker from 'expo-image-picker';
import { fetchPlaceDetail } from '../../../lib/api/places';
import { createReview, fetchPlaceReviews, toggleReviewLike } from '../../../lib/api/reviews';
import { uploadReviewImage } from '../../../lib/api/uploads';
import type { ReviewListItem } from '../../../lib/api/types';
import { getApiErrorMessage } from '../context/AuthContext';

function ReviewItem({ item, onLikeToggle }: { item: ReviewListItem; onLikeToggle: (id: string) => void }) {
  const handlePress = () => {
    onLikeToggle(item.id);
  };

  return (
    <View style={{ backgroundColor: colors.white, margin: 10, padding: 15, borderRadius: 20, elevation: 3 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row', columnGap: 10, alignItems: 'center' }}>
          <View style={[styles.avatarBorder, { width: 50, height: 50, overflow: 'hidden', borderRadius: 25 }]}>
            <Image source={{ uri: item.avatar }} style={{ height: '100%', width: '100%' }} resizeMode='cover' />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>{item.username}</Text>
            <View style={{ alignItems: 'flex-start', marginLeft: 0 }}>
              <RatingStartBar ratingValue={item.Rate} size={20} />
            </View>
          </View>
        </View>
        <Text style={{ color: '#908a8a', fontSize: 13 }}>{item.date}</Text>
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text style={{ color: '#4a4a4a', fontSize: 15, lineHeight: 22 }}>{item.content}</Text>
      </View>

      <PicturesContainer pictures={item.images} />

      <View style={{ flexDirection: 'row', columnGap: 25, marginTop: 5 }}>
        <TouchableHighlight underlayColor="transparent" onPress={handlePress}>
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
            <Fontisto name="like" size={20} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>{item.likes}</Text>
          </View>
        </TouchableHighlight>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', columnGap: 5 }}>
          <Octicons name="report" size={20} color="#908a8a" />
          <Text style={{ color: '#908a8a', fontSize: 16 }}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ViewReviewsScreen({ navigation, route }: any) {
  const placeId = route.params?.placeId as string | undefined;
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [placeRate, setPlaceRate] = useState(0);
  const [placeCount, setPlaceCount] = useState(0);
  const [coverImage, setCoverImage] = useState(
    'https://i.pinimg.com/1200x/6f/54/22/6f542272eef1c2846c752192ff2cd542.jpg'
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]);

  const loadData = useCallback(async () => {
    if (!placeId) return;
    setLoading(true);
    try {
      const [place, list] = await Promise.all([
        fetchPlaceDetail(placeId),
        fetchPlaceReviews(placeId),
      ]);
      setPlaceRate(place.Rate);
      setPlaceCount(place.NumberOfRate);
      setCoverImage(place.Image);
      setReviews(list);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLikeToggle = async (reviewId: string) => {
    try {
      const result = await toggleReviewLike(reviewId);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, likes: result.likes } : r))
      );
    } catch (err) {
      Alert.alert('Loi', getApiErrorMessage(err));
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Loi', 'Can quyen truy cap thu vien anh');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && pendingImages.length < 5) {
      setPendingImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleSubmitReview = async () => {
    if (!placeId || !reviewText.trim()) return;
    setSubmitting(true);
    try {
      const imageUrls: string[] = [];
      for (const uri of pendingImages) {
        try {
          const url = await uploadReviewImage(uri);
          imageUrls.push(url);
        } catch (err) {
          const msg = getApiErrorMessage(err);
          if (msg === 'STORAGE_UNAVAILABLE' && imageUrls.length === 0 && pendingImages[0] === uri) {
            Alert.alert(
              'Upload chua san sang',
              'Can service_role key (eyJ...) trong .env BE. Chay: npm run storage:verify'
            );
          }
        }
      }
      await createReview(placeId, {
        rating: userRating,
        content: reviewText.trim(),
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      });
      setReviewText('');
      setPendingImages([]);
      await loadData();
    } catch (err) {
      Alert.alert('Loi', getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const ratingStats = calculateRatingStats(reviews);

  if (!placeId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Thieu thong tin dia diem</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewItem item={item} onLikeToggle={handleLikeToggle} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <View style={{ alignItems: 'center' }}>
              <ImageBackground
                source={{ uri: coverImage }}
                style={[styles.imageFrame, { width: '100%', height: 450 }]}
                resizeMode="cover"
              >
                <View style={[styles.overlay, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                  <Pressable
                    style={[styles.roundButton, {
                      position: 'absolute', left: 15, top: 15, zIndex: 1,
                      backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20, padding: 5
                    }]}
                    onPress={() => navigation.goBack()}
                  >
                    <Ionicons name="chevron-back" size={25} color="white" />
                  </Pressable>

                  <Text style={{ color: colors.primary, fontSize: 60, fontWeight: 'bold' }}>
                    {placeRate}
                  </Text>
                  <RatingStartBar ratingValue={placeRate} size={30} />
                  <Text style={{ color: "#fff", fontSize: 16, marginTop: 10, letterSpacing: 1 }}>
                    {placeCount} VERIFIED REVIEWS
                  </Text>

                  <View style={ratingBarStyles.mainContainer}>
                    {ratingStats.map((stat) => (
                      <RatingBar key={stat.stars} stars={stat.stars} percentage={stat.percentage} />
                    ))}
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>
            Chua co danh gia nao. Hay la nguoi dau tien!
          </Text>
        }
      />

      {pendingImages.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 8 }}>
          {pendingImages.map((uri, idx) => (
            <View key={`${uri}-${idx}`} style={{ marginRight: 8, marginBottom: 8 }}>
              <Image source={{ uri }} style={{ width: 56, height: 56, borderRadius: 8 }} />
              <TouchableOpacity
                style={{ position: 'absolute', top: -6, right: -6 }}
                onPress={() => setPendingImages((prev) => prev.filter((_, i) => i !== idx))}
              >
                <Ionicons name="close-circle" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.bottomInputContainer}>
        <TouchableOpacity style={styles.addPhotoIcon} onPress={handlePickImage}>
          <Ionicons name="camera-outline" size={24} color="#908a8a" />
        </TouchableOpacity>
        <View style={{ marginRight: 8 }}>
          <RatingStartBar ratingValue={userRating} size={18} />
          <View style={{ flexDirection: 'row', marginTop: 4 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setUserRating(n)}>
                <Text style={{ fontSize: 12, color: userRating === n ? colors.primary : '#999', marginHorizontal: 2 }}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Write your review..."
          value={reviewText}
          onChangeText={setReviewText}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: reviewText && !submitting ? colors.primary : '#ddd' }]}
          disabled={!reviewText || submitting}
          onPress={handleSubmitReview}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="send" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
