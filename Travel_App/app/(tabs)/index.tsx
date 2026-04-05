import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import LogoutScreen from './screens/LogoutScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ProfileScreen from './screens/ProfileScreen';
import ViewReviewsScreen from './screens/ViewReviewsScreen';

export default function HomeScreen() {
  return (
    // <LoginScreen/>
    // <RegisterScreen/>
    // <LogoutScreen/>
    //<EditProfileScreen/>
    // <ProfileScreen/>
    <ViewReviewsScreen/>
  );
}
