import styles from './DetailLocationScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RatingStartBar } from '../components/Rating';
import { PicturesContainer } from '../components/ReviewPicture';

interface Review {
    ava: string;
    Name: string;
    Date: string;
    Content: string;
    Rate: number;
    Pictures: string[];
}

interface PlaceItemType {
    Id: string;
    Name: string;
    Location: string;
    Rate: number;
    NumberOfRate: number;
    Image: string;
    Features: string;
    Reviews: Review[];
}
const place: PlaceItemType = {
    Id: "1",
    Name: "Gion District",
    Location: "Kyoto, Japan",
    Rate: 4.9,
    NumberOfRate: 850,
    Image: "https://i.pinimg.com/1200x/28/31/da/2831da0f8a4b18fde25867ef90e66207.jpg",
    Features: "Quiet Now",
    Reviews: [
        {
            ava: "https://i.pinimg.com/736x/00/9f/c0/009fc09a302e18d5cb0c1ecc75d728e5.jpg",
            Name: "Elena Rogriguez",
            Date: "23 Oct 2024",
            Content: "Walking through Gion at dusk was magical. The lanterns began to glow and the atmosphere was simply fresh. This place is really suitable for trip with your family, enjoying cool weather and expriencing lots of fun activities.",
            Rate: 4,
            Pictures: ["https://i.pinimg.com/736x/72/41/dd/7241ddb23e868c19ec43a701104132f6.jpg", "https://i.pinimg.com/736x/97/24/45/97244547fc44fbc06968e4c72d2efdfc.jpg", "https://i.pinimg.com/736x/bb/58/12/bb58125d3147afab72f25250a23c9f05.jpg"]
        },
        {
            ava: "https://example.com/ava1.jpg",
            Name: "Emily Carlosste",
            Date: "03 Jul 2006",
            Content: "Gion in the evening is simply magical. The streets come alive with glowing lanterns and a refreshing, tranquil atmosphere. It’s a great spot for a family getaway, offering cool weather and plenty of fun experiences to enjoy.",
            Rate: 4,
            Pictures: []
        }
    ]
};



export default function DetailLocationScreen({ navigation }: any) {
    const [isLiked, setIsLiked] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleOpenImage = (url: any) => {
        setSelectedImage(url);
        setModalVisible(true);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#FFFFFF', marginVertical: 40 }}>
            <ScrollView style={[styles.container, { margin: 0 }]}>
                <View style={{ margin: 0, position: 'relative' }}>
                    <View style={[styles.imageFrame, { height: 350, borderRadius: 0, borderWidth: 0 }]}>
                        <Image
                            source={{ uri: place.Image }}
                            style={{ width: "100%", height: "100%" }} />
                    </View>
                    <Pressable style={styles.roundButton}
                        onPress={() => navigation.navigate("Main")}>
                        <Ionicons name="chevron-back" size={25}
                            color="white" />
                    </Pressable>
                    <Pressable style={[styles.roundButton, {
                        position: 'absolute',
                        right: 15,
                        top: 15,
                        zIndex: 1,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: 20,
                        padding: 5
                    }]}
                        onPress={() => setIsLiked(!isLiked)}>
                        <Ionicons name="heart"
                            size={24}
                            color={isLiked ? "white" : "red"} />
                    </Pressable>
                </View>

                <View style={{ borderRadius: 20, backgroundColor: '#FFFFFF', marginTop: -20 }}>
                    <View style={{ flexDirection: 'column', margin: 15 }}>
                        <Text style={{ fontSize: 25, fontWeight: '700', marginTop: 10 }}>
                            {place.Name}
                        </Text>
                        <View style={{ flexDirection: 'row', columnGap: 7 }}>
                            <Ionicons name="location-sharp" size={18} color="#00B4D8" />
                            <Text style={{ color: '#353232da', fontWeight: '600' }}>
                                {place.Location}
                            </Text>
                        </View>

                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ borderRadius: 15 }}>
                            <View style={[styles.detailCard, { marginLeft: 3 }]}>
                                <View style={{ borderRadius: 20, backgroundColor: "#FEF9C3", margin: 15, padding: 10 }}>
                                    <Ionicons name="star" size={18} color="#EAB308" />
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', marginRight: 15 }}>
                                    <View style={{ flexDirection: 'row', columnGap: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontWeight: '700', fontSize: 18 }}>
                                            {place.Rate}
                                        </Text>
                                        <Text style={{ fontWeight: '400', color: '#6B7280' }}>
                                            ({place.NumberOfRate})
                                        </Text>
                                    </View>
                                    <Text style={{ fontWeight: '600', color: '#6B7280' }}>
                                        RATINGS
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.detailCard}>
                                <View style={{ borderRadius: 20, backgroundColor: "#DCFCE7", margin: 15, padding: 10 }}>
                                    <Ionicons name="logo-usd" size={18} color="#22C55E" />
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', marginRight: 15 }}>
                                    <Text style={{ fontWeight: '700', fontSize: 18 }}>
                                        65.3
                                    </Text>
                                    <Text style={{ fontWeight: '600', color: '#6B7280' }}>
                                        PRICE LEVEL
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.detailCard}>
                                <View style={{ borderRadius: 20, backgroundColor: "#E0F2FE", margin: 15, padding: 10 }}>
                                    <Ionicons name="people" size={18} color="#0EA5E9" />
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', marginRight: 15 }}>
                                    <Text style={{ fontWeight: '700', fontSize: 18 }}>
                                        {place.Features}
                                    </Text>
                                    <Text style={{ fontWeight: '600', color: '#6B7280' }}>
                                        FEATURE
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>

                        <Text style={{ fontSize: 25, fontWeight: '700', marginTop: 10 }}>
                            About
                        </Text>
                        <Text style={{ marginTop: 10, color: '#353232da', fontWeight: '600', textAlign: 'justify' }}>
                            Experience the perfect tropical escape at Blue Lagoon Resort. Surrounded by lush jungles and crystal-clear waters, the resort offers a relaxing atmosphere with world-class amenities and stunning 360-degree coastal views.
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'column', margin: 15 }}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 25, fontWeight: '700', flex: 1 }}>
                                Reviews
                            </Text>

                            <Text style={{ color: '#00B4D8', fontWeight: '600' }}
                                onPress={() => navigation.navigate("All Reviews")}>
                                See All
                            </Text>
                        </View>


                        <PicturesContainer pictures={place.Reviews[0].Pictures}></PicturesContainer>

                        <View style={[styles.detailCard, { flexDirection: 'column', margin: 0, marginTop: 30, padding: 10, rowGap: 10 }]}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.imageFrame, { width: 60, height: 60, borderRadius: 30, borderWidth: 0 }]}>
                                    <Image
                                        source={{ uri: place.Reviews[0].ava }}
                                        style={{ width: "100%", height: "100%" }}
                                        resizeMode="cover" />
                                </View>
                                <View style={{ flexDirection: 'column', marginHorizontal: 10, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: '700' }}>
                                        {place.Reviews[0].Name}
                                    </Text>
                                    <Text style={{ color: '#353232da', fontWeight: '600' }}>
                                        {place.Reviews[0].Date}
                                    </Text>
                                </View>

                            </View>
                            <RatingStartBar ratingValue={place.Reviews[0].Rate} size={20}></RatingStartBar>

                            <Text style={{ marginLeft: 5 }}>
                                {place.Reviews[0].Content}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View >
    )
}



