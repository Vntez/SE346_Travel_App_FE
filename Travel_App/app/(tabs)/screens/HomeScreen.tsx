import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import { colors } from "../common/colors";
import styles from './HomeScreen.styles';
import { fetchPlaces } from '../../../lib/api/places';
import { planTrip } from '../../../lib/api/ai';
import type { PlaceListItem } from '../../../lib/api/types';
import { getApiErrorMessage } from '../context/AuthContext';

type Place = PlaceListItem;

const renderPlaceCard = (item: Place, navigation: any) => {
    //  const navigation = useNavigation<any>();
    return (
        <View style={styles.card}>
            <View style={styles.imageFrame}>
                <Image
                    source={{ uri: item.image }}
                    style={{ width: "100%", height: "100%" }} />
            </View>
            <View style={styles.contentContainer}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={{ fontSize: 22, fontWeight: '600' }}>
                        {item.Name}
                    </Text>
                    <Text style={{ color: colors.textSecondary }}>
                        {item.Located}
                    </Text>
                </View>
                <View style={styles.ratingBadge}>
                    <Text>
                        ⭐
                    </Text>
                    <Text style={{ fontWeight: '700' }}>
                        {item.Rate}
                    </Text>
                    <Text style={{ fontWeight: '400', color: colors.textMuted }}>
                        ({item.NumberOfRate})
                    </Text>
                </View>
            </View>
            <View style={styles.TagContainer} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ borderWidth: 1, borderColor: '#BFF0DB', backgroundColor: '#e5f6ef', padding: 5, borderRadius: 10 }}>
                    <Text style={{ color: '#00875A', fontWeight: '600' }}>
                        {item.Features}
                    </Text>
                </View>

                <Pressable onPress={() => navigation.navigate("Detail Location", { placeId: item.Id })}>
                    <Text style={{ fontWeight: '600', color: colors.primary }}>
                        Details
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};
export default function HomeScreen({ navigation }: any) {
    const renderPlaceItem = ({ item }: { item: Place }) => renderPlaceCard(item, navigation);
    const [activeCategory, setActiveCategory] = useState('Attractions');
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    const loadPlaces = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchPlaces(activeCategory);
            setPlaces(data);
        } catch {
            setPlaces([]);
        } finally {
            setLoading(false);
        }
    }, [activeCategory]);

    useEffect(() => {
        loadPlaces();
    }, [loadPlaces]);

    const handlePlanWithAi = async () => {
        const q = searchQuery.trim() || 'weekend trip';
        setAiLoading(true);
        try {
            const plan = await planTrip(q, 'Near me');
            const body = plan.suggestions
                .map((s, i) => `${i + 1}. ${s.title}\n${s.description}`)
                .join('\n\n');
            Alert.alert('Goi y chuyen di', `${body}\n\n${plan.note}`);
        } catch (err) {
            Alert.alert('Loi', getApiErrorMessage(err));
        } finally {
            setAiLoading(false);
        }
    };

    const renderHeader = () => {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: colors.textSecondary }}> Location</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="location-sharp" size={18} color={colors.primary} />
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}> Near me</Text>
                        <Pressable
                            onPress={() => alert('pressed down')}>
                            <Ionicons
                                name="chevron-down"
                                size={20}
                                color={colors.primary}
                                style={{ marginLeft: 2 }}
                            />
                        </Pressable>
                    </View>
                    <View style={styles.searchContainer}>
                        <TextInput
                            placeholder="Where to next ?"
                            style={{ flex: 1 }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Ionicons name="search"
                            size={20}
                            color={colors.textSecondary} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', columnGap: 10, marginHorizontal: 5 }}>
                    <Pressable
                        style={[styles.button, { flex: 1, height: 50, padding: 10 },
                        { backgroundColor: activeCategory === 'Attractions' ? colors.primary : colors.primaryLight }
                        ]}
                        onPress={() => setActiveCategory('Attractions')}>
                        <View style={styles.containerCategoryButton}>
                            <Image source={require('../../../assets/images/camera-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2 }}>
                            </Image>
                            <Text style={[styles.categoryButtonText, { color: 'black', fontSize: 15 }]}>
                                Attractions
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable
                        style={[styles.button, { flex: 1, height: 50 },
                        { backgroundColor: activeCategory === 'Dining' ? colors.primary : colors.primaryLight }
                        ]}
                        onPress={() => setActiveCategory('Dining')}>
                        <View style={styles.containerCategoryButton}>
                            <Image source={require('../../../assets/images/dining-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2 }}>
                            </Image>
                            <Text style={[styles.categoryButtonText, { color: 'black', fontSize: 15 }]}>
                                Dining
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable
                        style={[styles.button, { flex: 1, height: 50 },
                        { backgroundColor: activeCategory === 'Festivals' ? colors.primary : colors.primaryLight }]}
                        onPress={() => setActiveCategory('Festivals')}>
                        <View style={styles.containerCategoryButton}>
                            <Image source={require('../../../assets/images/festival-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2 }}>
                            </Image>
                            <Text style={[styles.categoryButtonText, { color: 'black', fontSize: 15 }]}>
                                Festivals
                            </Text>
                        </View>
                    </Pressable>
                </View>
                <View
                    style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                    <Pressable
                        style={{ flex: 1, borderRadius: 8, borderWidth: 2, borderColor: colors.primary, padding: 10 }}
                        onPress={handlePlanWithAi}
                        disabled={aiLoading}>
                        <View style={[styles.containerCategoryButton, { height: 40 }]}>
                            <Image source={require('../../../assets/images/AIPlan-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2 }}>
                            </Image>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text style={[styles.categoryButtonText, { flex: 1, fontSize: 15 }]}>
                                    {aiLoading ? 'Planning...' : 'Plan with AI'}
                                </Text>
                                <Text style={[styles.linkText, { fontSize: 12, color: 'gray' }]}>
                                    Get personalized trip ideas
                                </Text>
                            </View>
                            <Image source={require('../../../assets/images/right-arrow-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2, tintColor: colors.primary }}>
                            </Image>
                        </View>
                    </Pressable>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Text style={{ flex: 1, fontWeight: '500', fontSize: 23 }}>
                        Popular this week
                    </Text>
                </View>
            </View>
        )
    }
    if (loading && places.length === 0) {
        return (
            <View style={[styles.background, { justifyContent: 'center', alignItems: 'center', marginTop: 35 }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.background, { justifyContent: 'center', marginTop: 35 }]}>
            <View style={styles.container}>
                <FlatList
                    data={places}
                    renderItem={renderPlaceItem}
                    keyExtractor={(item) => item.Id}
                    ListHeaderComponent={renderHeader}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={loadPlaces}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>
                            Khong co dia diem nao
                        </Text>
                    }
                />
            </View>
        </View >
    )
}



