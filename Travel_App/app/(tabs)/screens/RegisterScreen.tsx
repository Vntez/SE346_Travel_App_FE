import Checkbox from 'expo-checkbox';
import styles from '@/app/(tabs)/AuthStyles';
import React, { useState } from 'react';
import { Image, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isCfPasswordVisible, setCfPasswordVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', marginTop: 40 }}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <View style={styles.imageFrame}>
            <Image
              source={{ uri: 'https://i.pinimg.com/736x/ed/d9/86/edd98622650c6f964291fef1a968adc6.jpg' }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <Text style={{ fontWeight: 'bold', fontSize: 35, textAlign: 'center', marginTop: 5 }}>
            Start your Journey
          </Text>
          <Text style={[styles.text, { marginTop: 5 }]}>Create an account to explore the world</Text>
        </View>

        <View style={[styles.inputContainer, { marginTop: 20 }]}>
          <Image
            source={require('../../../assets/images/user-icon.png')}
            style={{ width: 20, height: 20, marginRight: 2 }}
          />
          <TextInput placeholder="Full Name" style={{ flex: 1 }} />
        </View>

        <View style={styles.inputContainer}>
          <Image
            source={require('../../../assets/images/email-icon.png')}
            style={{ width: 20, height: 20, marginRight: 2 }}
          />
          <TextInput placeholder="Email Address" style={{ flex: 1 }} />
        </View>

        <View style={styles.inputContainer}>
          <Image
            source={require('../../../assets/images/password-icon.png')}
            style={{ width: 20, height: 20, marginRight: 2 }}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            style={{ flex: 1 }}
            keyboardType="default"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
            <Image
              source={
                isPasswordVisible
                  ? require('../../../assets/images/hidden_eyepassword-icon.png')
                  : require('../../../assets/images/eyepassword-icon.png')
              }
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Image
            source={require('../../../assets/images/cfpassword-icon.png')}
            style={{ width: 20, height: 20, marginRight: 2 }}
          />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!isCfPasswordVisible}
            style={{ flex: 1 }}
          />
          <TouchableOpacity onPress={() => setCfPasswordVisible(!isCfPasswordVisible)}>
            <Image
              source={
                isCfPasswordVisible
                  ? require('../../../assets/images/hidden_eyepassword-icon.png')
                  : require('../../../assets/images/eyepassword-icon.png')
              }
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10 }}>
          <Checkbox style={styles.checkbox} />
          <Text>
            I agree to the{' '}
            <Text style={styles.linkText} onPress={() => alert('Chuy?n hu?ng d?n trang di?u kho?n')}>
              Terms & Conditions
            </Text>
          </Text>
        </View>

        <View style={{ marginTop: 10, alignItems: 'center' }}>
          <Pressable style={styles.button} onPress={() => alert('pressed')}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Text style={[styles.text, { marginVertical: 10 }]}>Or sign up with</Text>
          <View style={styles.containerGG_Apple}>
            <Pressable style={styles.buttonGG_Apple} onPress={() => alert('Pressed')}>
              <View style={styles.containerImageGG_Apple}>
                <Image
                  source={require('../../../assets/images/google-icon.png')}
                  style={{ width: 20, height: 20, marginRight: 2 }}
                />
                <Text style={styles.buttonGG_AppleText}>Google</Text>
              </View>
            </Pressable>

            <Pressable style={styles.buttonGG_Apple} onPress={() => alert('Pressed')}>
              <View style={styles.containerImageGG_Apple}>
                <Image
                  source={require('../../../assets/images/apple-icon.png')}
                  style={{ width: 20, height: 20, marginRight: 2 }}
                />
                <Text style={styles.buttonGG_AppleText}>Apple</Text>
              </View>
            </Pressable>
          </View>
          <Text style={[styles.text, { marginVertical: 10 }]}>
            Already have an account?{' '}
            <Text style={styles.linkText} onPress={() => alert('Chuy?n hu?ng d?n trang dang nh?p')}>
              Login
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}