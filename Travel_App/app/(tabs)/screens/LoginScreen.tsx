import styles from './LoginScreen.styles';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageBackground,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth, getApiErrorMessage } from '../context/AuthContext';
import { forgotPassword, oauthLogin } from '../../../lib/api/auth';

export default function LoginScreen({ navigation }: any) {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Loi', 'Nhap email truoc khi dat lai mat khau');
            return;
        }
        try {
            const res = await forgotPassword(email.trim());
            Alert.alert('Thanh cong', res.message);
        } catch (err) {
            Alert.alert('Loi', getApiErrorMessage(err));
        }
    };

    const handleOAuth = async (provider: 'google' | 'apple') => {
        try {
            await oauthLogin(provider);
        } catch (err) {
            const msg = getApiErrorMessage(err);
            Alert.alert(
                'Chua ho tro',
                msg.includes('NOT_CONFIGURED')
                    ? `Dang nhap ${provider} chua duoc cau hinh tren server`
                    : msg
            );
        }
    };

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Loi', 'Vui long nhap email va mat khau');
            return;
        }
        setSubmitting(true);
        try {
            await login(email.trim(), password);
        } catch (err) {
            const msg = getApiErrorMessage(err);
            const text =
                msg === 'INVALID_CREDENTIALS'
                    ? 'Email hoac mat khau khong dung'
                    : msg;
            Alert.alert('Dang nhap that bai', text);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ImageBackground
            source={{ uri: "https://i.pinimg.com/736x/77/b4/21/77b421686d6088e6527cf57d68c69e96.jpg" }}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', marginTop: 40 }}>

                    <View style={{ alignItems: 'center', marginBottom: 40 }}>
                        <Image
                            source={{ uri: "https://cdn-icons-png.flaticon.com/128/201/201623.png" }}
                            style={{ height: 70, width: 70, marginBottom: 5 }}
                        />
                        <Text style={{ fontWeight: 'bold', fontSize: 32, textAlign: 'center', color: '#f2ebeb' }}>
                            Welcome Back
                        </Text>
                        <Text style={{ marginTop: 2, textAlign: 'center', color: '#b6adad', fontSize: 18 }}>
                            Log in to continue your adventure
                        </Text>
                    </View>

                    <View style={styles.container}>
                        <View style={[styles.inputContainer, { marginBottom: 20 }]}>
                            <Image
                                source={require('../../../assets/images/email-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 10 }}
                            />
                            <TextInput
                                placeholder="Email Address"
                                style={{ flex: 1 }}
                                placeholderTextColor="#ccc"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Image
                                source={require('../../../assets/images/password-icon.png')}
                                style={{ width: 20, height: 20, marginRight: 20 }}
                            />
                            <TextInput
                                placeholder="Password"
                                secureTextEntry={!isPasswordVisible}
                                style={{ flex: 1 }}
                                autoCapitalize="none"
                                placeholderTextColor="#ccc"
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
                                <Image
                                    source={isPasswordVisible
                                        ? require('../../../assets/images/hidden_eyepassword-icon.png')
                                        : require('../../../assets/images/eyepassword-icon.png')}
                                    style={{ width: 20, height: 20, marginRight: 20 }}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={{ alignItems: 'flex-end', paddingRight: 20, marginTop: 10 }}>
                            <TouchableOpacity onPress={handleForgotPassword}>
                                <Text style={styles.linkText}>Forgot Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.containerChild, { marginTop: 20, alignItems: 'center' }]}>
                        <Pressable style={styles.button} onPress={handleLogin} disabled={submitting}>
                            {submitting ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Log in</Text>
                            )}
                        </Pressable>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                        <View style={styles.lineContainer}>
                            <View style={styles.line} />
                            <Text style={styles.text}>Or continue with</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={[styles.containerGG_Apple, { marginTop: 20 }]}>
                            <Pressable style={styles.buttonGG_Apple} onPress={() => handleOAuth('google')}>
                                <View style={styles.containerImageGG_Apple}>
                                    <Image source={require('../../../assets/images/google-icon.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={styles.buttonGG_AppleText}>Google</Text>
                                </View>
                            </Pressable>

                            <Pressable style={styles.buttonGG_Apple} onPress={() => handleOAuth('apple')}>
                                <View style={styles.containerImageGG_Apple}>
                                    <Image source={require('../../../assets/images/apple-icon.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={styles.buttonGG_AppleText}>Apple</Text>
                                </View>
                            </Pressable>
                        </View>

                        <Text style={[styles.text, { marginTop: 40, color: '#ccc2c2', marginBottom: 40 }]}>
                            Don't have an account?{' '}
                            <Text style={styles.linkText} onPress={() => navigation.navigate("Register")}>
                                Register
                            </Text>
                        </Text>
                    </View>

                </ScrollView>
            </View>
        </ImageBackground>
    );
}
