import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showAppAlert, showErrorAlert } from '@/components/app-alert';
import styles from './HomeScreen.styles';
import { fetchPlaces } from '../../../lib/api/places';
import { planTrip } from '../../../lib/api/ai';
import type { PlaceListItem } from '../../../lib/api/types';
import { getApiErrorMessage, useAuth } from '../context/AuthContext';

type Place = PlaceListItem;
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const HERO_IMAGE =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85';
const FALLBACK_PLACE_IMAGE =
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80';

const categories: {
    key: string;
    label: string;
    icon: IconName;
    color: string;
    backgroundColor: string;
}[] = [
    {
        key: 'Attractions',
        label: 'Tham quan',
        icon: 'camera-outline',
        color: '#0369A1',
        backgroundColor: '#E0F2FE',
    },
    {
        key: 'Dining',
        label: 'Ẩm thực',
        icon: 'restaurant-outline',
        color: '#047857',
        backgroundColor: '#DFF7EA',
    },
    {
        key: 'Festivals',
        label: 'Lễ hội',
        icon: 'sparkles-outline',
        color: '#A16207',
        backgroundColor: '#FEF3C7',
    },
];

const featureLabels: Record<string, string> = {
    'Quiet Now': 'Yên tĩnh',
    'Open Now': 'Đang mở cửa',
    Popular: 'Được yêu thích',
    Outdoor: 'Ngoài trời',
    Indoor: 'Trong nhà',
    Romantic: 'Lãng mạn',
    'Family Friendly': 'Phù hợp gia đình',
};

const formatRatingCount = (value: number) => {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
    }
    return String(value);
};

const getFeatureLabel = (value?: string, fallback = 'Nổi bật') => {
    const normalized = value?.trim();
    if (!normalized) {
        return fallback;
    }
    return featureLabels[normalized] ?? normalized;
};

export default function HomeScreen({ navigation }: any) {
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState('Attractions');
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    const displayName = user?.fullName || user?.name || 'bạn';
    const activeCategoryLabel = categories.find((item) => item.key === activeCategory)?.label ?? 'địa điểm';

    const filteredPlaces = useMemo(() => {
        const keyword = searchQuery.trim().toLowerCase();
        if (!keyword) {
            return places;
        }

        return places.filter((place) => {
            const searchable = `${place.Name} ${place.Located} ${place.Features} ${getFeatureLabel(place.Features)}`.toLowerCase();
            return searchable.includes(keyword);
        });
    }, [places, searchQuery]);

    const averageRating = useMemo(() => {
        if (!places.length) {
            return '0.0';
        }

        const total = places.reduce((sum, place) => sum + Number(place.Rate || 0), 0);
        return (total / places.length).toFixed(1);
    }, [places]);

    const loadPlaces = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchPlaces(activeCategory);
            setPlaces(data);
        } catch (err) {
            setPlaces([]);
            showErrorAlert(getApiErrorMessage(err), 'Không tải được trang chủ');
        } finally {
            setLoading(false);
        }
    }, [activeCategory]);

    useEffect(() => {
        loadPlaces();
    }, [loadPlaces]);

    const handlePlanWithAi = async () => {
        const q = searchQuery.trim() || `Gợi ý lịch trình ${activeCategoryLabel.toLowerCase()}`;
        setAiLoading(true);
        try {
            const plan = await planTrip(q, 'Near me');
            const body = plan.suggestions
                .map((suggestion, index) => `${index + 1}. ${suggestion.title}\n${suggestion.description}`)
                .join('\n\n');

            showAppAlert({
                title: 'Gợi ý chuyến đi',
                message: `${body}\n\n${plan.note}`,
                type: 'info',
            });
        } catch (err) {
            showErrorAlert(getApiErrorMessage(err));
        } finally {
            setAiLoading(false);
        }
    };

    const renderPlaceCard = ({ item }: { item: Place }) => {
        const category = categories.find((entry) => entry.key === activeCategory) ?? categories[0];
        const featureLabel = getFeatureLabel(item.Features, category.label);

        return (
            <Pressable
                style={({ pressed }) => [styles.placeCard, pressed && styles.placeCardPressed]}
                onPress={() => navigation.navigate('Detail Location', {
                    placeId: item.Id,
                    placePreview: {
                        Id: item.Id,
                        Name: item.Name,
                        Location: item.Located,
                        Rate: item.Rate,
                        NumberOfRate: item.NumberOfRate,
                        Image: item.image,
                        Features: featureLabel,
                    },
                })}
            >
                <View style={styles.placeImageWrap}>
                    <Image source={{ uri: item.image || FALLBACK_PLACE_IMAGE }} style={styles.placeImage} />
                    <View style={styles.imageShade} />

                    <View style={styles.ratingPill}>
                        <Ionicons name="star" size={14} color="#F59E0B" />
                        <Text style={styles.ratingText}>{Number(item.Rate || 0).toFixed(1)}</Text>
                        <Text style={styles.ratingCount}>({formatRatingCount(item.NumberOfRate)})</Text>
                    </View>

                    <View style={[styles.featureBadge, { backgroundColor: category.backgroundColor }]}>
                        <Ionicons name={category.icon} size={14} color={category.color} />
                        <Text style={[styles.featureText, { color: category.color }]} numberOfLines={1}>
                            {featureLabel}
                        </Text>
                    </View>
                </View>

                <View style={styles.placeBody}>
                    <Text style={styles.placeTitle} numberOfLines={2}>
                        {item.Name}
                    </Text>

                    <View style={styles.placeLocationRow}>
                        <Ionicons name="location-outline" size={17} color="#64748B" />
                        <Text style={styles.placeLocation} numberOfLines={1}>
                            {item.Located}
                        </Text>
                    </View>

                    <View style={styles.placeFooter}>
                        <View style={styles.metaRow}>
                            <View style={styles.metaChip}>
                                <Ionicons name="time-outline" size={14} color="#475569" />
                                <Text style={styles.metaText}>Hôm nay</Text>
                            </View>
                            <View style={styles.metaChip}>
                                <Ionicons name="chatbubble-ellipses-outline" size={14} color="#475569" />
                                <Text style={styles.metaText}>{formatRatingCount(item.NumberOfRate)} đánh giá</Text>
                            </View>
                        </View>

                        <View style={styles.detailButton}>
                            <Text style={styles.detailButtonText}>Chi tiết</Text>
                            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                        </View>
                    </View>
                </View>
            </Pressable>
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContent}>
            <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.heroCard} imageStyle={styles.heroImage}>
                <View style={styles.heroOverlay} />

                <View style={styles.topBar}>
                    <View style={styles.locationChip}>
                        <Ionicons name="navigate-circle" size={18} color="#0F766E" />
                        <Text style={styles.locationText}>Gần bạn</Text>
                    </View>

                    <Pressable
                        style={styles.profileButton}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        {user?.avatarUrl ? (
                            <Image source={{ uri: user.avatarUrl }} style={styles.profileAvatar} />
                        ) : (
                            <Ionicons name="person" size={19} color="#0F172A" />
                        )}
                    </Pressable>
                </View>

                <View style={styles.heroCopy}>
                    <Text style={styles.greeting} numberOfLines={1}>
                        Xin chào, {displayName}
                    </Text>
                    <Text style={styles.heroTitle}>Bạn muốn đi đâu hôm nay?</Text>
                    <Text style={styles.heroSubtitle}>
                        Khám phá điểm đến, món ngon và lễ hội nổi bật quanh bạn.
                    </Text>
                </View>
            </ImageBackground>

            <View style={styles.searchPanel}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#64748B" />
                    <TextInput
                        placeholder="Tìm địa điểm, món ăn, lễ hội..."
                        placeholderTextColor="#94A3B8"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                    {searchQuery ? (
                        <Pressable style={styles.clearButton} onPress={() => setSearchQuery('')}>
                            <Ionicons name="close" size={17} color="#64748B" />
                        </Pressable>
                    ) : null}
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.aiCard,
                        pressed && styles.aiCardPressed,
                        aiLoading && styles.aiCardDisabled,
                    ]}
                    onPress={handlePlanWithAi}
                    disabled={aiLoading}
                >
                    <View style={styles.aiIconWrap}>
                        {aiLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Ionicons name="sparkles" size={20} color="#FFFFFF" />
                        )}
                    </View>
                    <View style={styles.aiCopy}>
                        <Text style={styles.aiTitle}>{aiLoading ? 'Đang lập lịch trình...' : 'Lập lịch trình bằng AI'}</Text>
                        <Text style={styles.aiSubtitle}>Dựa trên từ khóa và nhóm địa điểm bạn đang xem</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#0369A1" />
                </Pressable>
            </View>

            <View style={styles.sectionHeader}>
                <View>
                    <Text style={styles.sectionEyebrow}>Danh mục</Text>
                    <Text style={styles.sectionTitle}>Bạn thích trải nghiệm gì?</Text>
                </View>
            </View>

            <View style={styles.categoryGrid}>
                {categories.map((category) => {
                    const isActive = activeCategory === category.key;

                    return (
                        <Pressable
                            key={category.key}
                            style={[
                                styles.categoryButton,
                                { backgroundColor: isActive ? category.color : category.backgroundColor },
                            ]}
                            onPress={() => setActiveCategory(category.key)}
                        >
                            <View
                                style={[
                                    styles.categoryIcon,
                                    { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#FFFFFF' },
                                ]}
                            >
                                <Ionicons
                                    name={category.icon}
                                    size={20}
                                    color={isActive ? '#FFFFFF' : category.color}
                                />
                            </View>
                            <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                                {category.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{places.length}</Text>
                    <Text style={styles.statLabel}>Địa điểm</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{averageRating}</Text>
                    <Text style={styles.statLabel}>Điểm TB</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{filteredPlaces.length}</Text>
                    <Text style={styles.statLabel}>Phù hợp</Text>
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <View>
                    <Text style={styles.sectionEyebrow}>Nổi bật tuần này</Text>
                    <Text style={styles.sectionTitle}>{activeCategoryLabel} được đề xuất</Text>
                </View>
                <Pressable onPress={loadPlaces} style={styles.refreshButton}>
                    <Ionicons name="refresh" size={18} color="#0369A1" />
                </Pressable>
            </View>
        </View>
    );

    if (loading && places.length === 0) {
        return (
            <SafeAreaView style={styles.loadingScreen}>
                <View style={styles.loadingCard}>
                    <ActivityIndicator size="large" color="#0284C7" />
                    <Text style={styles.loadingText}>Đang tải địa điểm...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.screen} edges={['top']}>
            <FlatList
                data={filteredPlaces}
                renderItem={renderPlaceCard}
                keyExtractor={(item) => item.Id}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={loadPlaces}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.cardGap} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="map-outline" size={30} color="#0369A1" />
                        </View>
                        <Text style={styles.emptyTitle}>Chưa tìm thấy địa điểm</Text>
                        <Text style={styles.emptyText}>
                            Thử đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
