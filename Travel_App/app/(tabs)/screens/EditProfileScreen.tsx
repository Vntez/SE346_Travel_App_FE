import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from '@/app/(tabs)/AuthStyles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function EditProfileScreen() {
    return (
        <View style={{ flex: 1, justifyContent:'center', marginTop: 40 }}>
            <View style={[styles.container]}>
                <View style={{alignItems:'center'}}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarBorder}>
                            <Image source={{uri: 'https://th.bing.com/th/id/OIP.iY6OLSZImubhw9Yiwg6OuAHaHa?w=186&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'}}
                                style={{width: '100%', height: '100%'}}>
                            </Image>
                        </View>

                        <TouchableOpacity style={styles.iconContainer}>
                            <Image source={{uri: 'https://cdn-icons-png.flaticon.com/128/14025/14025489.png'}}
                                style={{width: '100%', height: '100%'}}>
                            </Image>
                    
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.containerChild}>
                    <Text style={{color: 'grey', fontSize: 15}}>
                        FULL NAME
                    </Text>
                    <View style={[styles.inputContainer, {margin: 0}]}>
                        <TextInput value="Alex Johnson" style={{ flex: 1 }} />
                    </View>
                </View>

                 <View style={styles.containerChild}>
                    <Text style={{color: 'grey', fontSize: 15}}>
                        USERNAME
                    </Text>
                    <View style={[styles.inputContainer, {margin: 0, rowGap: 10}]}>
                        <TextInput value="Alex_love_travel" style={{ flex: 1 }} />
                    </View>
                </View>

                <View style={styles.containerChild}>
                    <Text style={{color: 'grey', fontSize: 15}}>
                        LOCATION
                    </Text>
                    <View style={[styles.inputContainer, {margin: 0}]}>
                        <Image source={{uri: 'https://cdn-icons-png.flaticon.com/128/9800/9800512.png'}}
                            style={{width: 20, height: 20, marginRight: 5, marginTop: 2}}>
                        </Image>
                        <TextInput value="VietNam" style={{ flex: 1 }} />
                    </View>
                </View>

                <View style={[styles.containerChild, {marginTop: 10, alignItems:'center'}]}>
                    <Pressable style={styles.button} onPress={() => alert('Pressed')}>
                        <Text style={styles.buttonText}>Save Changes</Text>
                    </Pressable>
                </View>

            </View>
        </View>
    );
}