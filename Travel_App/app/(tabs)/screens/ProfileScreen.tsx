import styles from '@/app/(tabs)/AuthStyles';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
    const { logout } = useAuth();

    return (
        < View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
            <View style={[styles.containerChild, { marginTop: 10, alignItems: 'center' }]}>
                <Pressable style={[styles.button, { borderRadius: 5, width: 100, padding: 10 }]} onPress={logout}>
                    <Text style={styles.buttonText}>Log out</Text>
                </Pressable>
            </View>
        </View >
    )
}

