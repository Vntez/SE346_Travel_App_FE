import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getScheduleString } from '@/app/service/PromotionShedule';
import { showErrorAlert, showSuccessAlert } from '@/components/app-alert';
import {
  createPromotion,
  deletePromotion,
  getCachedOwnerPlaces,
  getCachedPlacePromotions,
  refreshOwnerPlaces,
  refreshPlacePromotions,
  togglePromotion,
  updatePromotion,
  type OwnerPlace,
} from '../../../lib/api/owner';
import PromotionEditor from '../components/PromotionEditor';
import type { PromotionItem } from '../types/promotion';
import { getApiErrorMessage } from '../context/AuthContext';
import styles from './OwnerManagementScreen.styles';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80';

const defaultSchedule = (): PromotionItem['schedule'] => ({
  startDate: '',
  endDate: '',
  days: ['M'],
  startTime: '8:00 AM',
  endTime: '5:00 PM',
  specificTime: false,
});

function PlaceCard({
  item,
  selected,
  onPress,
}: {
  item: OwnerPlace;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.placeCard, selected && styles.placeCardSelected]} onPress={onPress}>
      <Image source={{ uri: item.Image || FALLBACK_IMAGE }} style={styles.placeImage} />
      <View style={styles.placeContent}>
        <Text style={styles.placeName} numberOfLines={1}>{item.Name}</Text>
        <View style={styles.placeLocationRow}>
          <Ionicons name="location-outline" size={15} color="#64748B" />
          <Text style={styles.placeLocation} numberOfLines={1}>{item.Location}</Text>
        </View>
      </View>
      <View style={[styles.selectedMark, selected && styles.selectedMarkActive]}>
        <Ionicons name={selected ? 'checkmark' : 'chevron-forward'} size={18} color={selected ? '#FFFFFF' : '#94A3B8'} />
      </View>
    </Pressable>
  );
}

function PromotionCard({
  item,
  busy,
  onToggle,
  onEdit,
  onDelete,
}: {
  item: PromotionItem;
  busy: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.promotionCard}>
      <View style={styles.promotionHeader}>
        <View style={[styles.promotionStatus, item.isActive ? styles.promotionStatusActive : styles.promotionStatusInactive]}>
          <Ionicons
            name={(item.isActive ? 'flash' : 'pause-circle-outline') as IconName}
            size={14}
            color={item.isActive ? '#047857' : '#64748B'}
          />
          <Text style={[styles.promotionStatusText, !item.isActive && styles.promotionStatusTextInactive]}>
            {item.isActive ? 'Đang chạy' : 'Đã tạm dừng'}
          </Text>
        </View>

        <Pressable style={styles.toggleButton} onPress={onToggle} disabled={busy}>
          {busy ? (
            <ActivityIndicator size="small" color="#0284C7" />
          ) : (
            <Ionicons name={item.isActive ? 'toggle' : 'toggle-outline'} size={28} color={item.isActive ? '#0284C7' : '#94A3B8'} />
          )}
        </Pressable>
      </View>

      <Text style={styles.promotionTitle}>{item.title}</Text>
      <Text style={styles.promotionSchedule}>{getScheduleString(item.schedule)}</Text>

      <View style={styles.promotionActions}>
        <Pressable style={styles.secondaryAction} onPress={onEdit}>
          <Ionicons name="create-outline" size={17} color="#0369A1" />
          <Text style={styles.secondaryActionText}>Sửa</Text>
        </Pressable>

        <Pressable style={styles.dangerAction} onPress={onDelete}>
          <Ionicons name="trash-outline" size={17} color="#DC2626" />
          <Text style={styles.dangerActionText}>Xóa</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function OwnerManagementScreen({ navigation }: any) {
  const cachedPlaces = getCachedOwnerPlaces();
  const [places, setPlaces] = useState<OwnerPlace[]>(cachedPlaces ?? []);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(cachedPlaces?.[0]?.Id ?? null);
  const [promotions, setPromotions] = useState<PromotionItem[]>(
    cachedPlaces?.[0] ? getCachedPlacePromotions(cachedPlaces[0].Id) ?? [] : []
  );
  const [loading, setLoading] = useState(!cachedPlaces);
  const [refreshing, setRefreshing] = useState(false);
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [busyPromotionId, setBusyPromotionId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<PromotionItem | null>(null);

  const selectedPlace = useMemo(
    () => places.find((place) => place.Id === selectedPlaceId) ?? null,
    [places, selectedPlaceId]
  );

  const loadPlaces = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else if (!places.length) {
      setLoading(true);
    }

    try {
      const data = await refreshOwnerPlaces();
      setPlaces(data);
      setSelectedPlaceId((prev) => prev && data.some((place) => place.Id === prev) ? prev : data[0]?.Id ?? null);
    } catch (err) {
      showErrorAlert(getApiErrorMessage(err), 'Không tải được địa điểm');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [places.length]);

  const loadPromotions = useCallback(async (placeId: string) => {
    setPromotionLoading(true);
    try {
      const data = await refreshPlacePromotions(placeId);
      setPromotions(data);
    } catch (err) {
      setPromotions([]);
      showErrorAlert(getApiErrorMessage(err), 'Không tải được ưu đãi');
    } finally {
      setPromotionLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  useEffect(() => {
    if (!selectedPlaceId) {
      setPromotions([]);
      return;
    }

    const cached = getCachedPlacePromotions(selectedPlaceId);
    if (cached) {
      setPromotions(cached);
    }
    loadPromotions(selectedPlaceId);
  }, [loadPromotions, selectedPlaceId]);

  const openCreatePromotion = () => {
    setEditingPromotion(null);
    setShowEditor(true);
  };

  const handleSavePromotion = async (data: { title: string; schedule: PromotionItem['schedule'] }) => {
    if (!selectedPlace) return;

    try {
      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, {
          title: data.title,
          schedule: data.schedule,
        });
        showSuccessAlert('Đã cập nhật ưu đãi.');
      } else {
        await createPromotion(selectedPlace.Id, {
          title: data.title,
          isActive: true,
          schedule: data.schedule,
        });
        showSuccessAlert('Đã tạo ưu đãi mới.');
      }

      setShowEditor(false);
      setEditingPromotion(null);
      await loadPromotions(selectedPlace.Id);
    } catch (err) {
      showErrorAlert(getApiErrorMessage(err));
    }
  };

  const handleTogglePromotion = async (promotion: PromotionItem) => {
    setBusyPromotionId(promotion.id);
    setPromotions((prev) =>
      prev.map((item) => item.id === promotion.id ? { ...item, isActive: !item.isActive } : item)
    );

    try {
      const updated = await togglePromotion(promotion.id);
      setPromotions((prev) => prev.map((item) => item.id === updated.id ? updated : item));
    } catch (err) {
      setPromotions((prev) =>
        prev.map((item) => item.id === promotion.id ? promotion : item)
      );
      showErrorAlert(getApiErrorMessage(err));
    } finally {
      setBusyPromotionId(null);
    }
  };

  const handleDeletePromotion = async (promotion: PromotionItem) => {
    if (!selectedPlace) return;

    setBusyPromotionId(promotion.id);
    try {
      await deletePromotion(promotion.id);
      setPromotions((prev) => prev.filter((item) => item.id !== promotion.id));
      showSuccessAlert('Đã xóa ưu đãi.');
      await loadPromotions(selectedPlace.Id);
    } catch (err) {
      showErrorAlert(getApiErrorMessage(err));
    } finally {
      setBusyPromotionId(null);
    }
  };

  if (loading && !places.length) {
    return (
      <SafeAreaView style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#0284C7" />
        <Text style={styles.loadingText}>Đang tải địa điểm...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadPlaces(true)} tintColor="#0284C7" />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>Owner Center</Text>
            <Text style={styles.headerTitle}>Địa điểm</Text>
          </View>
          <Pressable style={styles.headerButton} onPress={() => navigation.navigate('Add Location')}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {places.length ? (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>Danh sách</Text>
                <Text style={styles.sectionTitle}>Địa điểm đang quản lý</Text>
              </View>
              <Text style={styles.countPill}>{places.length}</Text>
            </View>

            <View style={styles.placeList}>
              {places.map((place) => (
                <PlaceCard
                  key={place.Id}
                  item={place}
                  selected={place.Id === selectedPlaceId}
                  onPress={() => {
                    setSelectedPlaceId(place.Id);
                    setShowEditor(false);
                    setEditingPromotion(null);
                  }}
                />
              ))}
            </View>

            {selectedPlace ? (
              <View style={styles.selectedPanel}>
                <Image source={{ uri: selectedPlace.Image || FALLBACK_IMAGE }} style={styles.selectedImage} />
                <View style={styles.selectedOverlay} />
                <View style={styles.selectedContent}>
                  <Text style={styles.selectedTitle} numberOfLines={2}>{selectedPlace.Name}</Text>
                  <View style={styles.selectedLocationRow}>
                    <Ionicons name="location-outline" size={17} color="#E0F2FE" />
                    <Text style={styles.selectedLocation} numberOfLines={1}>{selectedPlace.Location}</Text>
                  </View>
                </View>
              </View>
            ) : null}

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>Ưu đãi</Text>
                <Text style={styles.sectionTitle}>Chiến dịch khuyến mãi</Text>
              </View>
              <Pressable style={styles.sectionAction} onPress={openCreatePromotion}>
                <Ionicons name="add" size={17} color="#0284C7" />
                <Text style={styles.sectionActionText}>Tạo</Text>
              </Pressable>
            </View>

            {showEditor ? (
              <PromotionEditor
                initialData={editingPromotion ?? {
                  title: '',
                  schedule: defaultSchedule(),
                }}
                onSave={handleSavePromotion}
                onCancel={() => {
                  setShowEditor(false);
                  setEditingPromotion(null);
                }}
              />
            ) : null}

            {promotionLoading && !promotions.length ? (
              <View style={styles.loadingPromotions}>
                <ActivityIndicator size="small" color="#0284C7" />
                <Text style={styles.loadingPromotionText}>Đang tải ưu đãi...</Text>
              </View>
            ) : null}

            {promotions.length ? (
              <View style={styles.promotionList}>
                {promotions.map((promotion) => (
                  <PromotionCard
                    key={promotion.id}
                    item={promotion}
                    busy={busyPromotionId === promotion.id}
                    onToggle={() => handleTogglePromotion(promotion)}
                    onEdit={() => {
                      setEditingPromotion(promotion);
                      setShowEditor(true);
                    }}
                    onDelete={() => handleDeletePromotion(promotion)}
                  />
                ))}
              </View>
            ) : !promotionLoading ? (
              <View style={styles.emptyPromoCard}>
                <View style={styles.emptyPromoIcon}>
                  <Ionicons name="pricetag-outline" size={28} color="#0284C7" />
                </View>
                <Text style={styles.emptyPromoTitle}>Chưa có ưu đãi</Text>
                <Text style={styles.emptyPromoText}>Tạo ưu đãi để tăng lượt ghé thăm địa điểm này.</Text>
                <Pressable style={styles.emptyPromoButton} onPress={openCreatePromotion}>
                  <Text style={styles.emptyPromoButtonText}>Tạo ưu đãi</Text>
                </Pressable>
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="storefront-outline" size={30} color="#0284C7" />
            </View>
            <Text style={styles.emptyTitle}>Chưa có địa điểm</Text>
            <Text style={styles.emptyText}>Tạo địa điểm đầu tiên để bắt đầu quản lý ưu đãi và thông tin hiển thị.</Text>
            <Pressable style={styles.emptyButton} onPress={() => navigation.navigate('Add Location')}>
              <Text style={styles.emptyButtonText}>Thêm địa điểm</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
