import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate, getScheduleString } from '@/app/service/PromotionShedule';
import { showAppAlert, showErrorAlert, showSuccessAlert } from '@/components/app-alert';
import PromotionEditor from '../components/PromotionEditor';
import { createOwnerPlace, refreshOwnerPlaces } from '../../../lib/api/owner';
import { uploadPlaceCover } from '../../../lib/api/uploads';
import type { PromotionItem } from '../types/promotion';
import { getApiErrorMessage } from '../context/AuthContext';
import { styles } from './AddLocationScreen.style';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';

const categories: {
  key: string;
  label: string;
  icon: IconName;
}[] = [
  { key: 'Restaurant', label: 'Nhà hàng', icon: 'restaurant-outline' },
  { key: 'Hotel', label: 'Khách sạn', icon: 'bed-outline' },
  { key: 'Attraction', label: 'Tham quan', icon: 'camera-outline' },
  { key: 'Cafe', label: 'Cà phê', icon: 'cafe-outline' },
];

const featureOptions = [
  { key: 'Open Now', label: 'Đang mở cửa', icon: 'time-outline' as IconName },
  { key: 'Popular', label: 'Được yêu thích', icon: 'flame-outline' as IconName },
  { key: 'Family Friendly', label: 'Phù hợp gia đình', icon: 'people-outline' as IconName },
  { key: 'Quiet Now', label: 'Yên tĩnh', icon: 'leaf-outline' as IconName },
];

const defaultSchedule = (): PromotionItem['schedule'] => ({
  startDate: formatDate(new Date()),
  endDate: formatDate(new Date()),
  days: ['M'],
  startTime: '8:00 AM',
  endTime: '5:00 PM',
  specificTime: false,
});

function LocalPromotionCard({
  item,
  onToggle,
  onEdit,
  onDelete,
}: {
  item: PromotionItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.promotionCard}>
      <View style={styles.promotionHeader}>
        <View style={[styles.promotionStatus, item.isActive ? styles.promotionStatusActive : styles.promotionStatusInactive]}>
          <Ionicons name={item.isActive ? 'flash' : 'pause-circle-outline'} size={14} color={item.isActive ? '#047857' : '#64748B'} />
          <Text style={[styles.promotionStatusText, !item.isActive && styles.promotionStatusTextInactive]}>
            {item.isActive ? 'Đang chạy' : 'Tạm dừng'}
          </Text>
        </View>

        <Pressable onPress={onToggle} style={styles.localToggleButton}>
          <Ionicons name={item.isActive ? 'toggle' : 'toggle-outline'} size={28} color={item.isActive ? '#0284C7' : '#94A3B8'} />
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

export default function AddLocationScreen({ navigation }: any) {
  const [activeCategory, setActiveCategory] = useState('Restaurant');
  const [featureLabel, setFeatureLabel] = useState('Open Now');
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingPromotion, setIsAddingPromotion] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('Vietnam');
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((item) => item.key === activeCategory) ?? categories[0],
    [activeCategory]
  );

  const coverImage = preview || DEFAULT_COVER;

  const resetForm = () => {
    setPlaceName('');
    setDescription('');
    setRegion('Vietnam');
    setPreview('');
    setPromotions([]);
    setActiveCategory('Restaurant');
    setFeatureLabel('Open Now');
    setEditingId(null);
    setIsAddingPromotion(false);
  };

  const handleImageChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showErrorAlert('Cần quyền truy cập thư viện ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.82,
    });

    if (!result.canceled) {
      setPreview(result.assets[0].uri);
    }
  };

  const handleSavePromotion = (id: string | null, data: { title: string; schedule: PromotionItem['schedule'] }) => {
    if (id) {
      setPromotions((prev) => prev.map((item) => item.id === id ? { ...item, ...data } : item));
      setEditingId(null);
      return;
    }

    const newPromotion: PromotionItem = {
      id: Date.now().toString(),
      title: data.title,
      isActive: true,
      schedule: data.schedule,
    };

    setPromotions((prev) => [newPromotion, ...prev]);
    setIsAddingPromotion(false);
  };

  const validate = () => {
    if (placeName.trim().length < 2) {
      showErrorAlert('Vui lòng nhập tên địa điểm có ít nhất 2 ký tự.');
      return false;
    }

    if (region.trim().length < 2) {
      showErrorAlert('Vui lòng nhập khu vực hoặc thành phố.');
      return false;
    }

    if (description.trim().length < 10) {
      showErrorAlert('Vui lòng nhập mô tả ít nhất 10 ký tự.');
      return false;
    }

    return true;
  };

  const handlePublish = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      let coverImageUrl = DEFAULT_COVER;

      if (preview) {
        try {
          coverImageUrl = await uploadPlaceCover(preview);
        } catch (err) {
          const msg = getApiErrorMessage(err);
          if (msg === 'STORAGE_UNAVAILABLE') {
            showAppAlert({
              title: 'Upload ảnh chưa sẵn sàng',
              message: 'Máy chủ chưa cấu hình lưu trữ ảnh. Địa điểm sẽ dùng ảnh mặc định.',
              type: 'warning',
            });
          }
        }
      }

      await createOwnerPlace({
        name: placeName.trim(),
        region: region.trim(),
        category: activeCategory,
        about: description.trim(),
        coverImageUrl,
        featureLabel,
        promotions: promotions.map((promotion) => ({
          title: promotion.title,
          isActive: promotion.isActive,
          schedule: promotion.schedule,
        })),
      });

      await refreshOwnerPlaces();
      showSuccessAlert('Đã tạo địa điểm mới.', 'Thành công', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      showErrorAlert(getApiErrorMessage(err), 'Không tạo được địa điểm');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Pressable style={styles.headerButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={23} color="#0F172A" />
            </Pressable>

            <View style={styles.headerTitleBlock}>
              <Text style={styles.headerEyebrow}>Owner Center</Text>
              <Text style={styles.headerTitle}>Tạo địa điểm</Text>
            </View>

            <Pressable style={styles.headerButton} onPress={resetForm}>
              <Ionicons name="refresh" size={21} color="#0F172A" />
            </Pressable>
          </View>

          <View style={styles.heroPreview}>
            <Image source={{ uri: coverImage }} style={styles.heroImage} />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.categoryPreview}>
                <Ionicons name={selectedCategory.icon} size={16} color="#0369A1" />
                <Text style={styles.categoryPreviewText}>{selectedCategory.label}</Text>
              </View>
              <Text style={styles.previewTitle} numberOfLines={2}>
                {placeName.trim() || 'Tên địa điểm'}
              </Text>
              <View style={styles.previewLocationRow}>
                <Ionicons name="location-outline" size={17} color="#E0F2FE" />
                <Text style={styles.previewLocation} numberOfLines={1}>
                  {region.trim() || 'Khu vực'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.noticeCard}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#047857" />
            <Text style={styles.noticeText}>
              Thông tin địa điểm nên chính xác vì sẽ hiển thị trực tiếp cho người dùng sau khi tạo.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

            <Text style={styles.label}>Tên địa điểm</Text>
            <View style={styles.inputShell}>
              <Ionicons name="storefront-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: The Grand View Hotel"
                placeholderTextColor="#94A3B8"
                value={placeName}
                onChangeText={setPlaceName}
              />
            </View>

            <Text style={styles.label}>Khu vực / Thành phố</Text>
            <View style={styles.inputShell}>
              <Ionicons name="location-outline" size={20} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: Kyoto, Japan"
                placeholderTextColor="#94A3B8"
                value={region}
                onChangeText={setRegion}
              />
            </View>

            <Text style={styles.label}>Danh mục</Text>
            <View style={styles.chipGrid}>
              {categories.map((category) => {
                const active = activeCategory === category.key;
                return (
                  <Pressable
                    key={category.key}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setActiveCategory(category.key)}
                  >
                    <Ionicons name={category.icon} size={18} color={active ? '#FFFFFF' : '#0284C7'} />
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{category.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Nhãn hiển thị</Text>
            <View style={styles.chipGrid}>
              {featureOptions.map((feature) => {
                const active = featureLabel === feature.key;
                return (
                  <Pressable
                    key={feature.key}
                    style={[styles.featureChip, active && styles.featureChipActive]}
                    onPress={() => setFeatureLabel(feature.key)}
                  >
                    <Ionicons name={feature.icon} size={17} color={active ? '#FFFFFF' : '#047857'} />
                    <Text style={[styles.featureChipText, active && styles.featureChipTextActive]}>{feature.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Mô tả</Text>
            <View style={[styles.inputShell, styles.textAreaShell]}>
              <Ionicons name="document-text-outline" size={20} color="#64748B" />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Mô tả điểm nổi bật, không gian, dịch vụ..."
                placeholderTextColor="#94A3B8"
                multiline
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Hình ảnh</Text>
            <Pressable style={styles.uploadBox} onPress={handleImageChange}>
              {preview ? (
                <Image source={{ uri: preview }} style={styles.uploadPreview} />
              ) : (
                <>
                  <View style={styles.uploadIcon}>
                    <Ionicons name="cloud-upload-outline" size={26} color="#0284C7" />
                  </View>
                  <Text style={styles.uploadTitle}>Tải ảnh bìa địa điểm</Text>
                  <Text style={styles.uploadSubtitle}>Nên dùng ảnh ngang rõ nét, JPG hoặc PNG.</Text>
                </>
              )}
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionEyebrow}>Ưu đãi</Text>
              <Text style={styles.sectionTitle}>Khuyến mãi đi kèm</Text>
            </View>
            <Pressable
              style={styles.sectionAction}
              onPress={() => {
                setIsAddingPromotion(true);
                setEditingId(null);
              }}
            >
              <Ionicons name="add" size={17} color="#0284C7" />
              <Text style={styles.sectionActionText}>Tạo</Text>
            </Pressable>
          </View>

          {isAddingPromotion ? (
            <PromotionEditor
              initialData={{ title: '', schedule: defaultSchedule() }}
              onSave={(data) => handleSavePromotion(null, data)}
              onCancel={() => setIsAddingPromotion(false)}
            />
          ) : null}

          {promotions.length ? (
            <View style={styles.promotionList}>
              {promotions.map((promotion) => (
                editingId === promotion.id ? (
                  <PromotionEditor
                    key={promotion.id}
                    initialData={promotion}
                    onSave={(data) => handleSavePromotion(promotion.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <LocalPromotionCard
                    key={promotion.id}
                    item={promotion}
                    onToggle={() =>
                      setPromotions((prev) =>
                        prev.map((item) => item.id === promotion.id ? { ...item, isActive: !item.isActive } : item)
                      )
                    }
                    onEdit={() => {
                      setEditingId(promotion.id);
                      setIsAddingPromotion(false);
                    }}
                    onDelete={() => setPromotions((prev) => prev.filter((item) => item.id !== promotion.id))}
                  />
                )
              ))}
            </View>
          ) : !isAddingPromotion ? (
            <View style={styles.emptyPromoCard}>
              <Ionicons name="pricetag-outline" size={28} color="#0284C7" />
              <Text style={styles.emptyPromoTitle}>Chưa có ưu đãi</Text>
              <Text style={styles.emptyPromoText}>Bạn có thể tạo ưu đãi ngay hoặc bổ sung sau trong màn quản lý.</Text>
            </View>
          ) : null}

          <Pressable
            style={[styles.publishButton, saving && styles.publishButtonDisabled]}
            onPress={handlePublish}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.publishButtonText}>Lưu và xuất bản</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
