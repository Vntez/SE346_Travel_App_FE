import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
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
import { showAppAlert, showErrorAlert, showSuccessAlert } from '@/components/app-alert';
import { updateMe } from '../../../lib/api/users';
import { getApiErrorMessage, useAuth } from '../context/AuthContext';
import styles from './EditProfileScreen.styles';

type FieldProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    placeholder: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    keyboardType?: 'default' | 'email-address' | 'url';
    editable?: boolean;
    multiline?: boolean;
};

const avatarPalettes = [
    { background: '#E0F2FE', color: '#0369A1' },
    { background: '#DCFCE7', color: '#047857' },
    { background: '#FEF3C7', color: '#A16207' },
    { background: '#FCE7F3', color: '#BE185D' },
    { background: '#EDE9FE', color: '#6D28D9' },
];

function getInitials(name: string) {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return 'U';
    const first = words[0]?.charAt(0) ?? '';
    const last = words.length > 1 ? words[words.length - 1]?.charAt(0) : words[0]?.charAt(1) ?? '';
    return `${first}${last}`.toUpperCase();
}

function getAvatarPalette(name: string) {
    const seed = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return avatarPalettes[seed % avatarPalettes.length];
}

function ProfileField({
    label,
    value,
    onChangeText,
    icon,
    placeholder,
    autoCapitalize = 'sentences',
    keyboardType = 'default',
    editable = true,
    multiline = false,
}: FieldProps) {
    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputShell, !editable && styles.inputShellDisabled, multiline && styles.inputShellMultiline]}>
                <Ionicons name={icon} size={20} color="#64748B" />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    editable={editable}
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    style={[styles.input, multiline && styles.inputMultiline]}
                />
            </View>
        </View>
    );
}

export default function EditProfileScreen({ navigation }: any) {
    const { user, refreshUser } = useAuth();
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [location, setLocation] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || user.name || '');
            setUsername(user.username || '');
            setLocation(user.location || '');
            setAvatarUrl(user.avatarUrl || '');
        }
    }, [user]);

    const displayName = fullName.trim() || user?.name || 'Người dùng';
    const initials = useMemo(() => getInitials(displayName), [displayName]);
    const avatarPalette = useMemo(() => getAvatarPalette(displayName), [displayName]);

    const hasChanges = useMemo(() => {
        if (!user) return false;
        return (
            fullName.trim() !== (user.fullName || user.name || '') ||
            username.trim() !== (user.username || '') ||
            location.trim() !== (user.location || '') ||
            avatarUrl.trim() !== (user.avatarUrl || '')
        );
    }, [avatarUrl, fullName, location, user, username]);

    const validate = () => {
        if (fullName.trim().length < 2) {
            showErrorAlert('Vui lòng nhập họ tên có ít nhất 2 ký tự.');
            return false;
        }

        const nextUsername = username.trim();
        if (nextUsername && !/^[a-zA-Z0-9._]{3,24}$/.test(nextUsername)) {
            showErrorAlert('Username chỉ gồm chữ, số, dấu chấm hoặc gạch dưới, dài từ 3 đến 24 ký tự.');
            return false;
        }

        const nextAvatarUrl = avatarUrl.trim();
        if (nextAvatarUrl && !/^https?:\/\/.+/i.test(nextAvatarUrl)) {
            showErrorAlert('URL ảnh đại diện phải bắt đầu bằng http:// hoặc https://.');
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!hasChanges) {
            navigation.goBack();
            return;
        }

        if (!validate()) {
            return;
        }

        setSaving(true);
        try {
            await updateMe({
                fullName: fullName.trim(),
                username: username.trim() || undefined,
                location: location.trim() || undefined,
                avatarUrl: avatarUrl.trim() || undefined,
            });
            await refreshUser();
            showSuccessAlert('Hồ sơ đã được cập nhật.');
            navigation.goBack();
        } catch (err) {
            showErrorAlert(getApiErrorMessage(err), 'Không lưu được hồ sơ');
        } finally {
            setSaving(false);
        }
    };

    const explainAvatar = () => {
        showAppAlert({
            title: 'Ảnh đại diện',
            message: 'Nếu không nhập URL ảnh, ứng dụng sẽ tự tạo avatar bằng chữ cái trong tên của bạn.',
            type: 'info',
        });
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
                            <Text style={styles.headerEyebrow}>Tài khoản</Text>
                            <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
                        </View>

                        <Pressable style={styles.headerButton} onPress={explainAvatar}>
                            <Ionicons name="information-circle-outline" size={23} color="#0F172A" />
                        </Pressable>
                    </View>

                    <View style={styles.profilePreview}>
                        <View
                            style={[
                                styles.avatarFrame,
                                !avatarUrl.trim() && { backgroundColor: avatarPalette.background },
                            ]}
                        >
                            {avatarUrl.trim() ? (
                                <Image source={{ uri: avatarUrl.trim() }} style={styles.avatarImage} />
                            ) : (
                                <Text style={[styles.avatarInitials, { color: avatarPalette.color }]}>
                                    {initials}
                                </Text>
                            )}
                        </View>

                        <View style={styles.profilePreviewText}>
                            <Text style={styles.previewName} numberOfLines={2}>
                                {displayName}
                            </Text>
                            <Text style={styles.previewMeta} numberOfLines={1}>
                                {username.trim() ? `@${username.trim()}` : 'Username chưa cập nhật'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.formCard}>
                        <ProfileField
                            label="Họ và tên"
                            value={fullName}
                            onChangeText={setFullName}
                            icon="person-outline"
                            placeholder="Nhập họ và tên"
                            autoCapitalize="words"
                        />

                        <ProfileField
                            label="Username"
                            value={username}
                            onChangeText={(value) => setUsername(value.replace(/\s/g, ''))}
                            icon="at-outline"
                            placeholder="tennguoidung"
                            autoCapitalize="none"
                        />

                        <ProfileField
                            label="Vị trí"
                            value={location}
                            onChangeText={setLocation}
                            icon="location-outline"
                            placeholder="Ví dụ: TP. Hồ Chí Minh"
                            autoCapitalize="words"
                        />

                        <ProfileField
                            label="URL ảnh đại diện"
                            value={avatarUrl}
                            onChangeText={setAvatarUrl}
                            icon="image-outline"
                            placeholder="https://..."
                            autoCapitalize="none"
                            keyboardType="url"
                            multiline
                        />

                        <View style={styles.noteBox}>
                            <Ionicons name="sparkles-outline" size={18} color="#0369A1" />
                            <Text style={styles.noteText}>
                                Không có ảnh? Avatar sẽ tự tạo từ chữ cái tên của bạn và đổi màu theo tên.
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        style={[
                            styles.saveButton,
                            (!hasChanges || saving) && styles.saveButtonDisabled,
                        ]}
                        onPress={handleSave}
                        disabled={!hasChanges || saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Text style={styles.saveButtonText}>
                                    {hasChanges ? 'Lưu thay đổi' : 'Không có thay đổi'}
                                </Text>
                                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                            </>
                        )}
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
