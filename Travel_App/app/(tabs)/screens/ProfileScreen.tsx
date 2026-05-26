import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showAppAlert } from '@/components/app-alert';
import styles from './ProfileScreen.styles';
import { useAuth } from '../context/AuthContext';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type MenuItem = {
  title: string;
  subtitle: string;
  icon: IconName;
  iconColor: string;
  iconBackground: string;
  onPress: () => void;
  danger?: boolean;
};

const avatarPalettes = [
  { background: '#E0F2FE', color: '#0369A1' },
  { background: '#DCFCE7', color: '#047857' },
  { background: '#FEF3C7', color: '#A16207' },
  { background: '#FCE7F3', color: '#BE185D' },
  { background: '#EDE9FE', color: '#6D28D9' },
];

function getInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return 'U';
  }

  const first = words[0]?.charAt(0) ?? '';
  const last = words.length > 1 ? words[words.length - 1]?.charAt(0) : words[0]?.charAt(1) ?? '';
  return `${first}${last}`.toUpperCase();
}

function getAvatarPalette(name: string) {
  const seed = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return avatarPalettes[seed % avatarPalettes.length];
}

function roleLabel(role?: string) {
  const normalized = role?.trim().toLowerCase();
  if (normalized === 'admin' || normalized === 'owner') {
    return 'Chủ địa điểm';
  }
  return 'Du khách';
}

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAuth();
  const displayName = user?.fullName || user?.name || 'Người dùng';
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const avatarPalette = useMemo(() => getAvatarPalette(displayName), [displayName]);

  const showComingSoon = (title: string) => {
    showAppAlert({
      title,
      message: 'Tính năng này sẽ được bổ sung trong phiên bản tiếp theo.',
      type: 'info',
    });
  };

  const menuItems: MenuItem[] = [
    {
      title: 'Chỉnh sửa hồ sơ',
      subtitle: 'Cập nhật tên, username và vị trí',
      icon: 'create-outline',
      iconColor: '#0369A1',
      iconBackground: '#E0F2FE',
      onPress: () => navigation.navigate('Edit Profile'),
    },
    {
      title: 'Địa điểm đã lưu',
      subtitle: 'Xem lại những nơi bạn quan tâm',
      icon: 'heart-outline',
      iconColor: '#BE123C',
      iconBackground: '#FFE4E6',
      onPress: () => showComingSoon('Địa điểm đã lưu'),
    },
    {
      title: 'Đánh giá của tôi',
      subtitle: 'Quản lý các đánh giá đã đóng góp',
      icon: 'chatbubble-ellipses-outline',
      iconColor: '#047857',
      iconBackground: '#DFF7EA',
      onPress: () => showComingSoon('Đánh giá của tôi'),
    },
    {
      title: 'Kỷ niệm chuyến đi',
      subtitle: 'Ảnh và ghi chú từ các hành trình',
      icon: 'images-outline',
      iconColor: '#6D28D9',
      iconBackground: '#EDE9FE',
      onPress: () => showComingSoon('Kỷ niệm chuyến đi'),
    },
    {
      title: 'Cài đặt',
      subtitle: 'Thông báo, quyền riêng tư và ứng dụng',
      icon: 'settings-outline',
      iconColor: '#475569',
      iconBackground: '#F1F5F9',
      onPress: () => showComingSoon('Cài đặt'),
    },
    {
      title: 'Đăng xuất',
      subtitle: 'Thoát khỏi tài khoản hiện tại',
      icon: 'log-out-outline',
      iconColor: '#DC2626',
      iconBackground: '#FEE2E2',
      onPress: () => navigation.navigate('Log Out'),
      danger: true,
    },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>Tài khoản</Text>
            <Text style={styles.headerTitle}>Trang cá nhân</Text>
          </View>

          <Pressable style={styles.headerIconButton} onPress={() => showComingSoon('Thông báo')}>
            <Ionicons name="notifications-outline" size={21} color="#0F172A" />
          </Pressable>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View
              style={[
                styles.avatarFrame,
                !user?.avatarUrl && { backgroundColor: avatarPalette.background },
              ]}
            >
              {user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={[styles.avatarInitials, { color: avatarPalette.color }]}>
                  {initials}
                </Text>
              )}
            </View>

            <Pressable style={styles.editAvatarButton} onPress={() => navigation.navigate('Edit Profile')}>
              <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
            </Pressable>

            <View style={styles.profileTextBlock}>
              <Text style={styles.displayName} numberOfLines={2}>
                {displayName}
              </Text>
              <Text style={styles.username} numberOfLines={1}>
                {user?.username ? `@${user.username}` : 'Chưa đặt username'}
              </Text>
            </View>
          </View>

          <View style={styles.accountBadgeRow}>
            <View style={styles.accountBadge}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#047857" />
              <Text style={styles.accountBadgeText}>{roleLabel(user?.role)}</Text>
            </View>
            <View style={styles.accountBadge}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#0369A1" />
              <Text style={styles.accountBadgeText}>Đang hoạt động</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons name="mail-outline" size={19} color="#0369A1" />
            </View>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {user?.email || 'Chưa có email'}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={[styles.infoIcon, styles.locationInfoIcon]}>
              <Ionicons name="location-outline" size={19} color="#047857" />
            </View>
            <Text style={styles.infoLabel}>Vị trí</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {user?.location || 'Chưa cập nhật'}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>Trung tâm cá nhân</Text>
          <Text style={styles.sectionTitle}>Quản lý trải nghiệm</Text>
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => {
            const isLast = index === menuItems.length - 1;

            return (
              <Pressable
                key={item.title}
                style={({ pressed }) => [
                  styles.menuItem,
                  !isLast && styles.menuDivider,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={item.onPress}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: item.iconBackground }]}>
                  <Ionicons name={item.icon} size={22} color={item.iconColor} />
                </View>

                <View style={styles.menuTextBlock}>
                  <Text style={[styles.menuTitle, item.danger && styles.dangerText]}>
                    {item.title}
                  </Text>
                  <Text style={styles.menuSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
