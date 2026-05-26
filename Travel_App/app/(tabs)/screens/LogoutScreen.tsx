import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import styles from './LogoutScreen.styles';

export default function LogoutScreen({ navigation }: any) {
  const { logout } = useAuth();

  const staySignedIn = () => {
    if (navigation.canGoBack?.()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={staySignedIn}>
          <Ionicons name="chevron-back" size={25} color="#0F172A" />
        </Pressable>

        <View style={styles.headerTextWrap}>
          <Text style={styles.headerEyebrow}>Tài khoản</Text>
          <Text style={styles.headerTitle}>Đăng xuất</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.routeLine}>
            <View style={styles.routeDot}>
              <Ionicons name="person-outline" size={18} color="#0284C7" />
            </View>
            <View style={styles.routeDash} />
            <View style={styles.routeDotActive}>
              <Ionicons name="lock-closed-outline" size={18} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.heroIcon}>
            <Ionicons name="log-out-outline" size={48} color="#0284C7" />
          </View>

          <Text style={styles.title}>Bạn muốn đăng xuất?</Text>
          <Text style={styles.description}>
            Phiên làm việc hiện tại sẽ kết thúc. Các địa điểm, đánh giá và hồ sơ của bạn vẫn được lưu khi đăng nhập lại.
          </Text>

          <View style={styles.noticeBox}>
            <Ionicons name="shield-checkmark-outline" size={21} color="#047857" />
            <Text style={styles.noticeText}>Dữ liệu tài khoản vẫn an toàn trên hệ thống.</Text>
          </View>
        </View>

        <View style={styles.actionGroup}>
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]} onPress={staySignedIn}>
            <Ionicons name="arrow-back-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Tiếp tục sử dụng</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}
            onPress={() => {
              void logout();
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={styles.dangerButtonText}>Đăng xuất tài khoản</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
