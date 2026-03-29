import styles from '@/app/(tabs)/AuthStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';

type Place = {
    Id: string;
    Name: string;
    Located: string;
    Rate: number;
    NumberOfRate: number;
    Features: string;
    image: string;
}
const AttractionsList: Place[] = [
    {
        Id: "1",
        Name: "Gion District",
        Located: "Kyoto, Japan ",
        Rate: 4.9,
        NumberOfRate: 850,
        Features: "Quiet Now",
        image: "https://i.pinimg.com/1200x/f1/9c/a0/f19ca09250c88864491e7cacecd1eb40.jpg"
    },
    {
        Id: "2",
        Name: "Gion District",
        Located: "Kyoto, Japan ",
        Rate: 4.9,
        NumberOfRate: 850,
        Features: "Quiet Now",
        image: "https://i.pinimg.com/1200x/28/31/da/2831da0f8a4b18fde25867ef90e66207.jpg"
    },
    {
        Id: "3",
        Name: "Gion District",
        Located: "Kyoto, Japan ",
        Rate: 4.9,
        NumberOfRate: 850,
        Features: "Quiet Now",
        image: "https://i.pinimg.com/1200x/28/31/da/2831da0f8a4b18fde25867ef90e66207.jpg"
    },
    {
        Id: "4",
        Name: "Gion District",
        Located: "Kyoto, Japan ",
        Rate: 4.9,
        NumberOfRate: 850,
        Features: "Quiet Now",
        image: "https://i.pinimg.com/1200x/28/31/da/2831da0f8a4b18fde25867ef90e66207.jpg"
    },
    {
        Id: "5",
        Name: "Gion District",
        Located: "Kyoto, Japan ",
        Rate: 4.9,
        NumberOfRate: 850,
        Features: "Quiet Now",
        image: "https://i.pinimg.com/1200x/28/31/da/2831da0f8a4b18fde25867ef90e66207.jpg"
    },
]

const DiningList: Place[] = [
    {
        Id: "1",
        Name: "Happy Restaurant",
        Located: "Tokyo, Japan ",
        Rate: 4.9,
        NumberOfRate: 850,
        Features: "Delicious",
        image: "https://i.pinimg.com/1200x/c5/c6/5f/c5c65fb0db0b42f2f1ca173b8fd38c56.jpg"
    },
    {
        Id: "2",
        Name: "Nicho Cafe",
        Located: "Seoul, Korea",
        Rate: 4.9,
        NumberOfRate: 120,
        Features: "Busy Now",
        image: "https://i.pinimg.com/736x/57/ac/d3/57acd3076ae2459723b90e1afbd8a5c0.jpg"
    },
    {
        Id: "3",
        Name: "Lile Bistro",
        Located: "Busan, Korea",
        Rate: 3.9,
        NumberOfRate: 50,
        Features: "Quiet Now",
        image: "https://i.pinimg.com/1200x/fa/0d/3d/fa0d3d02eb1a1d1e502351c280d76d81.jpg"
    },
]

const FestivalsList: Place[] = [
    {
        Id: "1",
        Name: "Cosplay Festival",
        Located: "Osaka, Japan ",
        Rate: 4.4,
        NumberOfRate: 1150,
        Features: "Happy",
        image: "https://i.pinimg.com/736x/e1/92/d8/e192d890ee057cf5accf14f7f6769ef2.jpg"
    },
    {
        Id: "2",
        Name: "Youth Festival",
        Located: "Kyoto, Japan",
        Rate: 4.1,
        NumberOfRate: 230,
        Features: "Busy Now",
        image: "https://i.pinimg.com/736x/0c/93/be/0c93be2773f8dcd49345e848e623724b.jpg"
    },
    {
        Id: "3",
        Name: "BlackPink Concert",
        Located: "Tokyo, Japan",
        Rate: 5.0,
        NumberOfRate: 8816,
        Features: "Really Crowded",
        image: "https://i.pinimg.com/1200x/43/42/ef/4342ef8c74138f70706cf3324a47066f.jpg"
    },
]

const renderPlaceCard = (item: Place, navigation: any) => {
    //  const navigation = useNavigation<any>();
    return (
        <View style={{ backgroundColor: '#FFFFFF', flexDirection: 'column', margin: 10, borderWidth: 1, borderRadius: 10, borderColor: '#EDF0F2', padding: 10 }}>
            <View style={styles.imageFrame}>
                <Image
                    source={{ uri: item.image }}
                    style={{ width: "100%", height: "100%" }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <View style={{ flexDirection: 'column', flex: 1 }}>
                    <Text style={{ fontSize: 22, fontWeight: '600' }}>
                        {item.Name}
                    </Text>
                    <Text style={{ color: '#353232da' }}>
                        {item.Located}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 10, borderColor: '#F0F3F5', padding: 5, columnGap: 5, backgroundColor: '#F0F3F5' }}>
                    <Text>
                        ⭐
                    </Text>
                    <Text style={{ fontWeight: '700' }}>
                        {item.Rate}
                    </Text>
                    <Text style={{ fontWeight: '400', color: '#6B7280' }}>
                        ({item.NumberOfRate})
                    </Text>
                </View>
            </View>
            <View style={{ height: 1, backgroundColor: '#EDF0F2', width: '100%', marginVertical: 10 }} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ borderWidth: 1, borderColor: '#BFF0DB', backgroundColor: '#e5f6ef', padding: 5, borderRadius: 10 }}>
                    <Text style={{ color: '#00875A', fontWeight: '600' }}>
                        {item.Features}
                    </Text>
                </View>

                <Pressable >
                    <Text style={{ fontWeight: '600', color: '#00AEEF' }}
                        onPress={() => navigation.navigate("Detail Location")}>
                        Details
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

export default function HomeScreen({ navigation }: any) {
    const [activeCategory, setActiveCategory] = useState('Attractions');
    const renderPlaceItem = ({ item }: { item: Place }) => renderPlaceCard(item, navigation);

    return (
        <View style={{ flex: 1, justifyContent: 'center', marginTop: 40, backgroundColor: '#FFFFFF' }}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'column' }}>
                    <Text> Location</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="location-sharp" size={18} color="#00B4D8" />
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}> Near me</Text>
                        <Pressable
                            onPress={() => alert('pressed down')}>
                            <Ionicons
                                name="chevron-down"
                                size={20}
                                color="#00B4D8"
                                style={{ marginLeft: 2 }}
                            />
                        </Pressable>

                    </View>
                    <View style={[styles.inputContainer, {
                        margin: 0, borderWidth: 2, marginTop: 10, paddingHorizontal: 10
                    }]}>
                        <TextInput placeholder="Where to next ?" style={{ flex: 1 }} />
                        <Ionicons name="search"
                            size={20}
                            color="gray" />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', columnGap: 10, marginHorizontal: 5 }}>
                    <Pressable
                        style={[styles.button, { flex: 1, height: 50, padding: 10 },
                        { backgroundColor: activeCategory === 'Attractions' ? '#47CCF0' : '#E3F2FD' }
                        ]}
                        onPress={() => setActiveCategory('Attractions')}>
                        <View style={styles.containerImageGG_Apple}>
                            <Image source={require('../../../assets/images/camera-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2 }}>
                            </Image>
                            <Text style={[styles.buttonGG_AppleText, { color: 'black', fontSize: 15 }]}>
                                Attractions
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable
                        style={[styles.button, { flex: 1, height: 50 },
                        { backgroundColor: activeCategory === 'Dining' ? '#47CCF0' : '#E3F2FD' }
                        ]}
                        onPress={() => setActiveCategory('Dining')}>
                        <View style={styles.containerImageGG_Apple}>
                            <Image source={require('../../../assets/images/dining-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2 }}>
                            </Image>
                            <Text style={[styles.buttonGG_AppleText, { color: 'black', fontSize: 15 }]}>
                                Dining
                            </Text>
                        </View>
                    </Pressable>

                    <Pressable
                        style={[styles.button, { flex: 1, height: 50 },
                        { backgroundColor: activeCategory === 'Festivals' ? '#47CCF0' : '#E3F2FD' }]}
                        onPress={() => setActiveCategory('Festivals')}>
                        <View style={styles.containerImageGG_Apple}>
                            <Image source={require('../../../assets/images/festival-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2 }}>
                            </Image>
                            <Text style={[styles.buttonGG_AppleText, { color: 'black', fontSize: 15 }]}>
                                Festivals
                            </Text>
                        </View>
                    </Pressable>
                </View>

                <View
                    style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                    <Pressable
                        style={{ flex: 1, borderRadius: 8, borderWidth: 2, borderColor: '#69b3c8', padding: 10 }}
                        onPress={() => alert('Plan with AI pressed')}>
                        <View style={[styles.containerImageGG_Apple, { height: 40 }]}>
                            <Image source={require('../../../assets/images/AIPlan-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2 }}>
                            </Image>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text style={[styles.buttonGG_AppleText, { flex: 1, fontSize: 15 }]}>
                                    Plan with AI
                                </Text>
                                <Text style={[styles.linkText, { fontSize: 12, color: 'gray' }]}>
                                    Get personalized trip ideas
                                </Text>
                            </View>
                            <Image source={require('../../../assets/images/right-arrow-icon.png')}
                                style={{ width: 25, height: 25, marginRight: 2, tintColor: '#47CCF0' }}>
                            </Image>
                        </View>
                    </Pressable>
                </View>

                <View style={{ flexDirection: 'column', marginTop: 10, backgroundColor: '#F2F4F5', flex: 1, borderRadius: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                        <Text style={{ flex: 1, fontWeight: '500', fontSize: 23 }}>
                            Popular this week
                        </Text>

                    </View>

                    <FlatList
                        data={activeCategory === 'Attractions'
                            ? AttractionsList
                            : activeCategory === 'Dining'
                                ? DiningList
                                : FestivalsList}
                        keyExtractor={(item) => item.Id}
                        renderItem={renderPlaceItem} />
                </View>

            </View>
        </View >
    )
}



