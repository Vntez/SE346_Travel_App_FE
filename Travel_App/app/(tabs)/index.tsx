import DetailLocationScreen from './screens/DetailLocationScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import LogoutScreen from './screens/LogoutScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ProfileScreen from './screens/ProfileScreen';
import ViewReviewsScreen from './screens/ViewReviewsScreen';
import RegisterScreen from './screens/RegisterScreen';

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AddLocationScreen from './screens/AddLocationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarActiveTintColor: '#00B4D8',
      tabBarInactiveTintColor: 'gray'
    })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} />

      <Tab.Screen name="AddNewPlace" component={AddLocationScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} 
        />
    </Tab.Navigator>
  );
};

const RootNavigation = () => {
  const { user } = useAuth();
  return (
    <>
      {!user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Detail Location"
            component={DetailLocationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Log Out"
            component={LogoutScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="All Reviews"
            component={ViewReviewsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Edit Profile"
            component={EditProfileScreen}
            options={{ headerShown: true, presentation: 'modal', title: "Edit Profile" , headerStyle: 
              {
                backgroundColor: '#FFFFFF' ,
              },
            headerShadowVisible: false,
            headerTintColor: '#000',
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
