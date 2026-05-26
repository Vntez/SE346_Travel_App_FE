import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFriendlyMessage, showAppAlert, showErrorAlert, showSuccessAlert } from '@/components/app-alert';
import { useAuth, getApiErrorMessage } from '../context/AuthContext';
import { forgotPassword, oauthLogin } from '../../../lib/api/auth';
import styles from './LoginScreen.styles';

const AUTH_BACKGROUND =
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&h=1600&q=85';

export default function LoginScreen({ navigation }: any) {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [forgotVisible, setForgotVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSubmitting, setResetSubmitting] = useState(false);
    const { login } = useAuth();

    const openForgotPassword = () => {
        setResetEmail(email.trim());
        setForgotVisible(true);
    };

    const closeForgotPassword = () => {
        if (!resetSubmitting) {
            setForgotVisible(false);
        }
    };

    const handleForgotPassword = async () => {
        const nextEmail = resetEmail.trim();
        if (!nextEmail) {
            showErrorAlert('Vui lòng nhập email để đặt lại mật khẩu.');
            return;
        }

        setResetSubmitting(true);
        try {
            const res = await forgotPassword(nextEmail);
            setEmail(nextEmail);
            setForgotVisible(false);
            showSuccessAlert(getFriendlyMessage(res.message));
        } catch (err) {
            showErrorAlert(getApiErrorMessage(err));
        } finally {
            setResetSubmitting(false);
        }
    };

    const handleOAuth = async (provider: 'google' | 'apple') => {
        try {
            await oauthLogin(provider);
        } catch (err) {
            const msg = getApiErrorMessage(err);
            const providerLabel = provider === 'google' ? 'Google' : 'Apple';
            showAppAlert({
                title: 'Chưa hỗ trợ',
                message: msg.includes('NOT_CONFIGURED')
                    ? `Đăng nhập bằng ${providerLabel} chưa được cấu hình trên máy chủ.`
                    : getFriendlyMessage(msg),
                type: 'warning',
            });
        }
    };

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            showErrorAlert('Vui lòng nhập email và mật khẩu.');
            return;
        }
        setSubmitting(true);
        try {
            await login(email.trim(), password);
        } catch (err) {
            const msg = getApiErrorMessage(err);
            showErrorAlert(msg, 'Đăng nhập thất bại');
        } finally {
            setSubmitting(false);
        }
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
                            <Text style={styles.heroTitle}>Chào mừng trở lại</Text>
                            <Text style={styles.heroSubtitle}>Đăng nhập để tiếp tục hành trình của bạn.</Text>
                        </View>

                        <View style={styles.formCard}>
                            <View style={styles.formHeader}>
                                <Text style={styles.formTitle}>Đăng nhập</Text>
                                <Text style={styles.formSubtitle}>Quản lý chuyến đi, đánh giá và ưu đãi của bạn.</Text>
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
                                <View style={styles.passwordLabelRow}>
                                    <Text style={styles.label}>Mật khẩu</Text>
                                    <TouchableOpacity onPress={openForgotPassword}>
                                        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputShell}>
                                    <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
                                    <TextInput
                                        placeholder="Nhập mật khẩu"
                                        secureTextEntry={!isPasswordVisible}
                                        style={styles.input}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholderTextColor="#94A3B8"
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

                            <Pressable
                                style={({ pressed }) => [
                                    styles.primaryButton,
                                    (pressed || submitting) && styles.primaryButtonPressed,
                                ]}
                                onPress={handleLogin}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Text style={styles.primaryButtonText}>Đăng nhập</Text>
                                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                                    </>
                                )}
                            </Pressable>

                            <View style={styles.dividerRow}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>Hoặc tiếp tục với</Text>
                                <View style={styles.divider} />
                            </View>

                            <View style={styles.socialRow}>
                                <Pressable style={styles.socialButton} onPress={() => handleOAuth('google')}>
                                    <Image source={require('../../../assets/images/google-icon.png')} style={styles.socialIcon} />
                                    <Text style={styles.socialText}>Google</Text>
                                </Pressable>

                                <Pressable style={styles.socialButton} onPress={() => handleOAuth('apple')}>
                                    <Image source={require('../../../assets/images/apple-icon.png')} style={styles.socialIcon} />
                                    <Text style={styles.socialText}>Apple</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.registerRow}>
                            <Text style={styles.registerText}>Chưa có tài khoản?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.registerLink}>Đăng ký</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <Modal
                transparent
                visible={forgotVisible}
                animationType="fade"
                statusBarTranslucent
                onRequestClose={closeForgotPassword}
            >
                <KeyboardAvoidingView
                    style={styles.forgotBackdrop}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.forgotCard}>
                        <View style={styles.forgotHeader}>
                            <View style={styles.forgotIconWrap}>
                                <Ionicons name="mail-unread-outline" size={26} color="#0EA5E9" />
                            </View>
                            <TouchableOpacity
                                style={styles.forgotCloseButton}
                                onPress={closeForgotPassword}
                                disabled={resetSubmitting}
                            >
                                <Ionicons name="close" size={22} color="#334155" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.forgotTitle}>Đặt lại mật khẩu</Text>
                        <Text style={styles.forgotDescription}>
                            Nhập email đã đăng ký. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
                        </Text>

                        <Text style={styles.forgotLabel}>Email</Text>
                        <View style={styles.forgotInputShell}>
                            <Ionicons name="mail-outline" size={20} color="#64748B" />
                            <TextInput
                                value={resetEmail}
                                onChangeText={setResetEmail}
                                placeholder="you@example.com"
                                placeholderTextColor="#94A3B8"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                style={styles.forgotInput}
                            />
                        </View>

                        <View style={styles.forgotActions}>
                            <Pressable
                                style={styles.forgotSecondaryButton}
                                onPress={closeForgotPassword}
                                disabled={resetSubmitting}
                            >
                                <Text style={styles.forgotSecondaryText}>Hủy</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.forgotPrimaryButton, resetSubmitting && styles.primaryButtonPressed]}
                                onPress={handleForgotPassword}
                                disabled={resetSubmitting}
                            >
                                {resetSubmitting ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.forgotPrimaryText}>Gửi yêu cầu</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </ImageBackground>
    );
}
