import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import VNTezSplashScreen from '@/components/VNTezSplashScreen';
import AddLocationScreen from './screens/AddLocationScreen';
import DashboardScreen from './screens/DashboardScreen';
import DetailLocationScreen from './screens/DetailLocationScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import LogoutScreen from './screens/LogoutScreen';
import OwnerManagementScreen from './screens/OwnerManagementScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ViewReviewsScreen from './screens/ViewReviewsScreen';
import { AuthProvider, useAuth } from './context/AuthContext';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const isOwnerRole = (role?: string | null) => {
  const normalized = role?.trim().toLowerCase();
  return normalized === 'owner' || normalized === 'admin';
};

const getTabIcon = (routeName: string, focused: boolean): IconName => {
  if (routeName === 'Home') return focused ? 'home' : 'home-outline';
  if (routeName === 'Dashboard') return focused ? 'bar-chart' : 'bar-chart-outline';
  if (routeName === 'Manage') return focused ? 'storefront' : 'storefront-outline';
  return focused ? 'person' : 'person-outline';
};

const tabScreenOptions = ({ route }: { route: { name: string } }) => ({
  headerShown: false,
  tabBarActiveTintColor: '#0284C7',
  tabBarInactiveTintColor: '#94A3B8',
  tabBarShowLabel: true,
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '800' as const,
    marginTop: 2,
  },
  tabBarItemStyle: {
    paddingVertical: 8,
  },
  tabBarStyle: {
    height: 74,
    borderTopWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },
  tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
    <View
      style={{
        width: 38,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        backgroundColor: focused ? '#E0F2FE' : 'transparent',
      }}
    >
      <Ionicons name={getTabIcon(route.name, focused)} size={21} color={color} />
    </View>
  ),
});

const MainTabs = () => (
  <Tab.Navigator screenOptions={tabScreenOptions}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Trang chủ' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Cá nhân' }}
    />
  </Tab.Navigator>
);

const OwnerTabs = () => (
  <Tab.Navigator screenOptions={tabScreenOptions}>
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ title: 'Tổng quan' }}
    />
    <Tab.Screen
      name="Manage"
      component={OwnerManagementScreen}
      options={{ title: 'Địa điểm' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Cá nhân' }}
    />
  </Tab.Navigator>
);

const OwnerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={OwnerTabs} />
    <Stack.Screen name="Add Location" component={AddLocationScreen} />
    <Stack.Screen name="Log Out" component={LogoutScreen} />
    <Stack.Screen
      name="Edit Profile"
      component={EditProfileScreen}
      options={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
);

const UserStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen name="Detail Location" component={DetailLocationScreen} />
    <Stack.Screen name="Log Out" component={LogoutScreen} />
    <Stack.Screen name="All Reviews" component={ViewReviewsScreen} />
    <Stack.Screen
      name="Edit Profile"
      component={EditProfileScreen}
      options={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
);

const RootNavigation = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <VNTezSplashScreen />;
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }

  return isOwnerRole(user.role) ? <OwnerStack /> : <UserStack />;
};

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
