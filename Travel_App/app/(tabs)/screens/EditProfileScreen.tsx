import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './EditProfileScreen.styles';
import { useAuth, getApiErrorMessage } from '../context/AuthContext';
import { updateMe } from '../../../lib/api/users';

const DEFAULT_AVATAR =
  'https://th.bing.com/th/id/OIP.iY6OLSZImubhw9Yiwg6OuAHaHa?w=186&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3';

export default function EditProfileScreen({ navigation }: any) {
    const { user, refreshUser } = useAuth();
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [location, setLocation] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || user.name || '');
            setUsername(user.username || '');
            setLocation(user.location || '');
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateMe({
                fullName: fullName.trim() || undefined,
                username: username.trim() || undefined,
                location: location.trim() || undefined,
            });
            await refreshUser();
            navigation.goBack();
        } catch (err) {
            const msg = getApiErrorMessage(err);
            const text = msg === 'USERNAME_TAKEN' ? 'Username da duoc su dung' : msg;
            Alert.alert('Loi', text);
        } finally {
            setSaving(false);
        }
    };

    const avatar = user?.avatarUrl || DEFAULT_AVATAR;

    return (
        <View style={{ flex: 1, justifyContent:'center', marginTop: 0, backgroundColor: '#FFFFFF' }}>
            <View style={[styles.container]}>
                <View style={{alignItems:'center'}}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarBorder}>
                            <Image source={{uri: avatar}}
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
                        <TextInput value={fullName} onChangeText={setFullName} style={{ flex: 1 }} />
                    </View>
                </View>

                 <View style={styles.containerChild}>
                    <Text style={{color: 'grey', fontSize: 15}}>
                        USERNAME
                    </Text>
                    <View style={[styles.inputContainer, {margin: 0, rowGap: 10}]}>
                        <TextInput value={username} onChangeText={setUsername} style={{ flex: 1 }} autoCapitalize="none" />
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
                        <TextInput value={location} onChangeText={setLocation} style={{ flex: 1 }} />
                    </View>
                </View>

                <View style={[styles.containerChild, {marginTop: 10, alignItems:'center'}]}>
                    <Pressable style={styles.button} onPress={handleSave} disabled={saving}>
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Save Changes</Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
