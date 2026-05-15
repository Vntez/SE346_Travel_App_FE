import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './ProfileScreen.styles';

export default function ProfileScreen({ navigation }: any) {
    return (
        <View style={{ flex: 1, marginTop: 40, backgroundColor: '#ffff' }}>
            <View style={[styles.container, { marginTop: 20 }]}>
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarBorder}>
                            <Image source={{ uri: 'https://th.bing.com/th/id/OIP.iY6OLSZImubhw9Yiwg6OuAHaHa?w=186&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3' }}
                                style={{ width: '100%', height: '100%' }}>
                            </Image>
                        </View>

                        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("Edit Profile")}>
                            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/10337/10337572.png' }}
                                style={{ width: '100%', height: '100%' }}>
                            </Image>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
                        Alex Johnson
                    </Text>
                </View>

                <View style={styles.profileMenuContainer}>
                    <TouchableOpacity style={styles.profileMenuItemContainer}>
                        <View style={[styles.profileMenuItemIcon, { backgroundColor: '#f0d3e8' }]}>
                            <Ionicons name="heart" size={30} color="#da2c2c" />
                        </View>
                        <View style={styles.profileMenuTextContainer}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                                Saved Places
                            </Text>
                            <Text style={{ color: '#928d8d', fontSize: 15 }}>
                                View your favourite places
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#cbc8c8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.profileMenuItemContainer}>
                        <View style={[styles.profileMenuItemIcon, { backgroundColor: '#c8c2f3' }]}>
                            <Ionicons name="images" size={25} color="#2e22d3" />
                        </View>
                        <View style={styles.profileMenuTextContainer}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                                Trips Memories
                            </Text>
                            <Text style={{ color: '#928d8d', fontSize: 15 }}>
                                Take a trip down memory lane
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#cbc8c8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.profileMenuItemContainer]}>
                        <View style={[styles.profileMenuItemIcon, { backgroundColor: '#daf7b5' }]}>
                            <MaterialIcons name="rate-review" size={28} color="#a4c626" />
                        </View>
                        <View style={styles.profileMenuTextContainer}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                                Your Reviews
                            </Text>
                            <Text style={{ color: '#928d8d', fontSize: 15 }}>
                                Manage your contributions
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#cbc8c8" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.profileMenuItemContainer]}>
                        <View style={[styles.profileMenuItemIcon, { backgroundColor: '#c4c2c2' }]}>
                            <Ionicons name="settings-sharp" size={30} color="#000000" />
                        </View>
                        <View style={styles.profileMenuTextContainer}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                                Settings
                            </Text>
                            <Text style={{ color: '#928d8d', fontSize: 15 }}>
                                Account and app preferences
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#cbc8c8" />
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={[styles.profileMenuItemContainer]}>
                        <View style={[styles.profileMenuItemIcon, {backgroundColor: '#c4c2c2'}]}>
                            <Ionicons name="settings-sharp" size={30} color="#000000" />
                        </View>
                        <View style={styles.profileMenuTextContainer}>
                            <Text style={{fontWeight: 'bold', fontSize: 20}}>
                                Privacy & Security
                            </Text>
                            <Text style={{color: '#928d8d', fontSize: 15}}>
                                Account and app preferences
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#cbc8c8"/>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={[styles.profileMenuItemContainer]} onPress={() => navigation.navigate('Log Out')}>
                        <View style={[styles.profileMenuItemIcon, { backgroundColor: '#ffff' }]}>
                            <Ionicons name="log-out" size={30} color="#eb2727" />
                        </View>
                        <View style={styles.profileMenuTextContainer}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                                Log Out
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
