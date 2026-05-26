import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showAppAlert, showErrorAlert } from '@/components/app-alert';
import { useAuth, getApiErrorMessage } from '../context/AuthContext';
import styles from './RegisterScreen.styles';

const AUTH_BACKGROUND =
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&h=1600&q=85';

export default function RegisterScreen({ navigation }: any) {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isCfPasswordVisible, setCfPasswordVisible] = useState(false);
    const [isChecked, setChecked] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { register } = useAuth();

    const handleRegister = async () => {
        if (!isChecked) {
            showErrorAlert('Vui lòng đồng ý với điều khoản sử dụng.');
            return;
        }
        if (!email.trim() || !password) {
            showErrorAlert('Vui lòng nhập email và mật khẩu.');
            return;
        }
        if (password.length < 8) {
            showErrorAlert('Mật khẩu phải có ít nhất 8 ký tự.');
            return;
        }
        if (password !== confirmPassword) {
            showErrorAlert('Mật khẩu xác nhận không khớp.');
            return;
        }

        setSubmitting(true);
        try {
            await register(email.trim(), password, fullName.trim() || undefined);
        } catch (err) {
            const msg = getApiErrorMessage(err);
            showErrorAlert(msg, 'Đăng ký thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const showTerms = () => {
        showAppAlert({
            title: 'Điều khoản sử dụng',
            message: 'Trang điều khoản sử dụng sẽ được bổ sung sau.',
            type: 'info',
        });
    };

    const showSocialPending = (provider: 'Google' | 'Apple') => {
        showAppAlert({
            title: 'Chưa hỗ trợ',
            message: `Đăng ký bằng ${provider} chưa được cấu hình.`,
            type: 'warning',
        });
    };

    return (
        <ImageBackground source={{ uri: AUTH_BACKGROUND }} style={styles.background} resizeMode="cover">
            <StatusBar style="light" translucent backgroundColor="transparent" />
            <View style={styles.overlay} />
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <View style={styles.header}>
                            <View style={styles.brandPill}>
                                <Ionicons name="airplane" size={18} color="#0EA5E9" />
                                <Text style={styles.brandText}>Travel App</Text>
                            </View>
                            <Text style={styles.heroTitle}>Bắt đầu hành trình</Text>
                            <Text style={styles.heroSubtitle}>Tạo tài khoản để lưu địa điểm, đánh giá và nhận ưu đãi.</Text>
                        </View>

                        <View style={styles.formCard}>
                            <View style={styles.formHeader}>
                                <Text style={styles.formTitle}>Đăng ký</Text>
                                <Text style={styles.formSubtitle}>Chỉ mất một phút để chuẩn bị chuyến đi tiếp theo.</Text>
                            </View>

                            <View style={styles.field}>
                                <Text style={styles.label}>Họ và tên</Text>
                                <View style={styles.inputShell}>
                                    <Ionicons name="person-outline" size={20} color="#64748B" />
                                    <TextInput
                                        placeholder="Nguyễn Văn A"
                                        style={styles.input}
                                        placeholderTextColor="#94A3B8"
                                        value={fullName}
                                        onChangeText={setFullName}
                                    />
                                </View>
                            </View>

                            <View style={styles.field}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputShell}>
                                    <Ionicons name="mail-outline" size={20} color="#64748B" />
                                    <TextInput
                                        placeholder="you@example.com"
                                        style={styles.input}
                                        placeholderTextColor="#94A3B8"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            </View>

                            <View style={styles.field}>
                                <Text style={styles.label}>Mật khẩu</Text>
                                <View style={styles.inputShell}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
                                    <TextInput
                                        placeholder="Tối thiểu 8 ký tự"
                                        secureTextEntry={!isPasswordVisible}
                                        style={styles.input}
                                        placeholderTextColor="#94A3B8"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() => setPasswordVisible(!isPasswordVisible)}
                                    >
                                        <Ionicons
                                            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                                            size={22}
                                            color="#0F172A"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.field}>
                                <Text style={styles.label}>Xác nhận mật khẩu</Text>
                                <View style={styles.inputShell}>
                                    <Ionicons name="shield-checkmark-outline" size={20} color="#64748B" />
                                    <TextInput
                                        placeholder="Nhập lại mật khẩu"
                                        secureTextEntry={!isCfPasswordVisible}
                                        style={styles.input}
                                        placeholderTextColor="#94A3B8"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={() => setCfPasswordVisible(!isCfPasswordVisible)}
                                    >
                                        <Ionicons
                                            name={isCfPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                                            size={22}
                                            color="#0F172A"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.termsRow}>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={isChecked}
                                    onValueChange={setChecked}
                                    color={isChecked ? '#0EA5E9' : undefined}
                                />
                                <Text style={styles.termsText}>
                                    Tôi đồng ý với{' '}
                                    <Text style={styles.termsLink} onPress={showTerms}>
                                        Điều khoản sử dụng
                                    </Text>
                                </Text>
                            </View>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.primaryButton,
                                    (pressed || submitting) && styles.primaryButtonPressed,
                                ]}
                                onPress={handleRegister}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Text style={styles.primaryButtonText}>Tạo tài khoản</Text>
                                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                                    </>
                                )}
                            </Pressable>

                            <View style={styles.dividerRow}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>Hoặc đăng ký với</Text>
                                <View style={styles.divider} />
                            </View>

                            <View style={styles.socialRow}>
                                <Pressable style={styles.socialButton} onPress={() => showSocialPending('Google')}>
                                    <Image source={require('../../../assets/images/google-icon.png')} style={styles.socialIcon} />
                                    <Text style={styles.socialText}>Google</Text>
                                </Pressable>

                                <Pressable style={styles.socialButton} onPress={() => showSocialPending('Apple')}>
                                    <Image source={require('../../../assets/images/apple-icon.png')} style={styles.socialIcon} />
                                    <Text style={styles.socialText}>Apple</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.loginRow}>
                            <Text style={styles.loginText}>Đã có tài khoản?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Đăng nhập</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}
