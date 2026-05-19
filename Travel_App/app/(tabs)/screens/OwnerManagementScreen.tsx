import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { colors } from "../common/colors";
import PromotionEditor from '../components/PromotionEditor';
import styles from './OwnerManagementScreen.styles';

type Place = {
    Id: string;
    Name: string;
    Location: string;
    Image: string;
}
const placeList: Place[] = [
    {
        Id: "1",
        Name: "Gion District",
        Location: "Kyoto, Japan ",
        Image: "https://i.pinimg.com/1200x/f1/9c/a0/f19ca09250c88864491e7cacecd1eb40.jpg"
    },
    {
        Id: "2",
        Name: "Gion District",
        Location: "Kyoto, Japan ",
        Image: "https://i.pinimg.com/1200x/28/31/da/2831da0f8a4b18fde25867ef90e66207.jpg"
    },
    {
        Id: "3",
        Name: "Gion District",
        Location: "Kyoto, Japan ",
        Image: "https://i.pinimg.com/1200x/28/31/da/2831da0f8a4b18fde25867ef90e66207.jpg"
    }

];

export const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};
const renderPlace = (item: Place, onEdit: (item: Place) => void) => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: item.Image }}
                    style={styles.cardImage}
                />
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.placeName} numberOfLines={1}>{item.Name}</Text>
                <Text style={styles.locationText} numberOfLines={1}>{item.Location}</Text>
                <View style={[styles.buttonRow, { justifyContent: 'flex-end' }]}>
                    <TouchableOpacity style={styles.btnEdit} onPress={() => onEdit(item)}>
                        <Ionicons name="pencil" size={14} color="#212121" />
                        <Text style={styles.btnEditText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


export default function OwnerManagementScreen({ navigation }: any) {
    const flatListRef = React.useRef<FlatList>(null);
    const [editingData, setEditingData] = useState<any | null>(null);

    const [selectedPlace, setSelectedPlace] = React.useState<Place>(placeList[0]);
    const handleEditPress = (item: Place) => {
        setSelectedPlace(item);
        flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: true
        });

    }
    const handleSave = (data: any) => {
        alert("Saved");
        setEditingData(null);
    };
    const handleCancel = () => {
        setEditingData(null);
    }

    const HeaderComponent = () => (
        <View>
            <View style={{ flexDirection: 'row', margin: 10, marginBottom: 0, alignItems: 'center', justifyContent: "space-between" }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.roundButton}>
                        <Ionicons name="storefront" size={35} color={colors.primary} />
                    </View>

                    <View style={{ flexDirection: 'column', margin: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Dashboard</Text>
                        <Text style={[styles.linkText, { color: "#90a4ae" }]}>Welcome back, Alex</Text>
                    </View>
                </View>
                <View style={{ paddingRight: 10 }}>
                    <Ionicons name="notifications" size={30} color="black" />
                </View>
            </View>
            <View style={{ marginHorizontal: 15 }}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Add Location")}>
                    <Text style={styles.buttonText}>
                        + Add New Place
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 10, marginVertical: 15, padding: 5 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 10 }}>Your Locations</Text>
                <View style={{ margin: 0, marginBottom: 20, position: 'relative' }}>
                    <View style={[styles.imageFrame, { height: 180, borderRadius: 10, borderWidth: 0 }]}>
                        <Image
                            source={{ uri: selectedPlace.Image }}
                            style={{ width: "100%", height: "100%" }}
                            blurRadius={1} />
                    </View>
                    <Text style={{
                        position: 'absolute',
                        left: 15,
                        bottom: 30,
                        zIndex: 1,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 20,
                        padding: 5
                    }}>
                        {selectedPlace.Name}
                    </Text>
                    <Text style={{
                        position: 'absolute',
                        left: 15,
                        bottom: 8,
                        zIndex: 1,
                        color: '#e2e8f0',
                        fontWeight: '500',
                        fontSize: 15,
                        padding: 5
                    }}>
                        {selectedPlace.Location}
                    </Text>
                </View>
                <View>
                    <PromotionEditor
                        initialData={editingData}
                        onSave={(data) => handleSave(data)}
                        onCancel={() => handleCancel()}
                    />
                </View>

            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center', marginTop: 30 }}>
            <FlatList
                ref={flatListRef}
                data={placeList}
                renderItem={({ item }) => renderPlace(item, handleEditPress)}
                keyExtractor={(item) => item.Id.toString()}
                ListHeaderComponent={HeaderComponent}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </View >
    )
}
