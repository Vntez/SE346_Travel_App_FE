import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showErrorAlert } from '@/components/app-alert';
import {
  getCachedOwnerPlaces,
  refreshOwnerPlaces,
  refreshPlacePromotions,
  type OwnerPlace,
} from '../../../lib/api/owner';
import type { PromotionItem } from '../types/promotion';
import { getApiErrorMessage, useAuth } from '../context/AuthContext';
import styles from './DashboardScreen.styles';

type PlaceWithPromotions = OwnerPlace & {
  promotions: PromotionItem[];
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80';

const formatCount = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return String(value);
};

export default function DashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [places, setPlaces] = useState<PlaceWithPromotions[]>(
    (getCachedOwnerPlaces() ?? []).map((place) => ({ ...place, promotions: [] }))
  );
  const [loading, setLoading] = useState(!getCachedOwnerPlaces());
  const [refreshing, setRefreshing] = useState(false);

  const displayName = user?.fullName || user?.name || 'chủ địa điểm';

  const stats = useMemo(() => {
    const promotionCount = places.reduce((sum, place) => sum + place.promotions.length, 0);
    const activePromotionCount = places.reduce(
      (sum, place) => sum + place.promotions.filter((promo) => promo.isActive).length,
      0
    );

    return {
      placeCount: places.length,
      promotionCount,
      activePromotionCount,
    };
  }, [places]);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (!places.length) {
      setLoading(true);
    }

    try {
      const nextPlaces = await refreshOwnerPlaces();
      const promotions = await Promise.all(
        nextPlaces.map(async (place) => {
          try {
            const list = await refreshPlacePromotions(place.Id);
            return [place.Id, list] as const;
          } catch {
            return [place.Id, [] as PromotionItem[]] as const;
          }
        })
      );
      const promotionsByPlace = new Map(promotions);

      setPlaces(
        nextPlaces.map((place) => ({
          ...place,
          promotions: promotionsByPlace.get(place.Id) ?? [],
        }))
      );
    } catch (err) {
      showErrorAlert(getApiErrorMessage(err), 'Không tải được dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [places.length]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const recentPlaces = places.slice(0, 3);

  if (loading && !places.length) {
    return (
      <SafeAreaView style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.loadingText}>Đang tải dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadDashboard(true)} tintColor="#0284C7" />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>Owner Center</Text>
            <Text style={styles.headerTitle}>Tổng quan</Text>
          </View>
          <Pressable style={styles.headerButton} onPress={() => navigation.navigate('Add Location')}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="storefront-outline" size={26} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Chào {displayName}</Text>
          <Text style={styles.heroSubtitle}>
            Theo dõi địa điểm, ưu đãi và trạng thái vận hành trong một màn hình.
          </Text>
          <Pressable style={styles.heroButton} onPress={() => navigation.navigate('Add Location')}>
            <Text style={styles.heroButtonText}>Tạo địa điểm mới</Text>
            <Ionicons name="arrow-forward" size={18} color="#0F766E" />
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.placeIcon]}>
              <Ionicons name="map-outline" size={20} color="#0369A1" />
            </View>
            <Text style={styles.statValue}>{formatCount(stats.placeCount)}</Text>
            <Text style={styles.statLabel}>Địa điểm</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.promoIcon]}>
              <Ionicons name="pricetag-outline" size={20} color="#047857" />
            </View>
            <Text style={styles.statValue}>{formatCount(stats.promotionCount)}</Text>
            <Text style={styles.statLabel}>Ưu đãi</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.activeIcon]}>
              <Ionicons name="flash-outline" size={20} color="#A16207" />
            </View>
            <Text style={styles.statValue}>{formatCount(stats.activePromotionCount)}</Text>
            <Text style={styles.statLabel}>Đang chạy</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Địa điểm gần đây</Text>
            <Text style={styles.sectionTitle}>Tài sản của bạn</Text>
          </View>
          <Pressable style={styles.sectionAction} onPress={() => navigation.navigate('Manage')}>
            <Text style={styles.sectionActionText}>Quản lý</Text>
          </Pressable>
        </View>

        {recentPlaces.length ? (
          <View style={styles.placeList}>
            {recentPlaces.map((place) => (
              <Pressable
                key={place.Id}
                style={styles.placeCard}
                onPress={() => navigation.navigate('Manage')}
              >
                <Image source={{ uri: place.Image || FALLBACK_IMAGE }} style={styles.placeImage} />
                <View style={styles.placeContent}>
                  <Text style={styles.placeName} numberOfLines={1}>{place.Name}</Text>
                  <View style={styles.placeMetaRow}>
                    <Ionicons name="location-outline" size={15} color="#64748B" />
                    <Text style={styles.placeLocation} numberOfLines={1}>{place.Location}</Text>
                  </View>
                  <Text style={styles.placePromotionText}>
                    {place.promotions.length} ưu đãi, {place.promotions.filter((promo) => promo.isActive).length} đang chạy
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="storefront-outline" size={30} color="#0284C7" />
            </View>
            <Text style={styles.emptyTitle}>Chưa có địa điểm</Text>
            <Text style={styles.emptyText}>Tạo địa điểm đầu tiên để bắt đầu quản lý kinh doanh trên Travel App.</Text>
            <Pressable style={styles.emptyButton} onPress={() => navigation.navigate('Add Location')}>
              <Text style={styles.emptyButtonText}>Thêm địa điểm</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
