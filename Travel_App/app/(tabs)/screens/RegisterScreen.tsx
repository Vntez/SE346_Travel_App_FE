import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen({ navigation }: any) {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isCfPasswordVisible, setCfPasswordVisible] = useState(false);

    return (
        <View style={{ flex: 1, justifyContent: 'center', marginTop: 40 }}>
            <View style={styles.container}>
                <View style={{ flexDirection: "column", alignItems: 'center' }}>
                    <View style={styles.imageFrame}>
                        <Image
                            source={{ uri: "https://i.pinimg.com/736x/ed/d9/86/edd98622650c6f964291fef1a968adc6.jpg" }}
                            style={{ width: "100%", height: "100%" }} />
                    </View>
                    <Text style={{
                        fontWeight: 'bold', fontSize: 35, textAlign: 'center', marginTop: 5

                    }}> Start your Journey </Text>
                    <Text style={[styles.text, { marginTop: 5 }]}>
                        Create an account to explore the world
                    </Text>
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
                    <TextInput placeholder="Password"
                        secureTextEntry={!isPasswordVisible}
                        style={{ flex: 1 }}
                        keyboardType='default'
                        autoCorrect={false}
                        autoCapitalize="none" />
                    <TouchableOpacity
                        onPress={() => setPasswordVisible(!isPasswordVisible)} >
                        <Image
                            source={
                                isPasswordVisible
                                    ? require('../../../assets/images/hidden_eyepassword-icon.png')
                                    : require('../../../assets/images/eyepassword-icon.png')}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Image
                        source={require('../../../assets/images/cfpassword-icon.png')}
                        style={{ width: 20, height: 20, marginRight: 2 }}
                    />
                    <TextInput placeholder="Confirm Password"
                        secureTextEntry={true}
                        style={{ flex: 1 }} />
                    <TouchableOpacity
                        onPress={() => setCfPasswordVisible(!isCfPasswordVisible)} >
                        <Image
                            source={
                                isCfPasswordVisible
                                    ? require('../../../assets/images/hidden_eyepassword-icon.png')
                                    : require('../../../assets/images/eyepassword-icon.png')}
                            style={{ width: 20, height: 20 }}
                            resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10 }}>
                    <Checkbox
                        style={styles.checkbox}
                    //  value={isChecked}
                    //  onValueChange={setChecked}
                    // color={isChecked ? '#4630EB' : undefined} // Màu khi tích vào
                    />
                    <Text>
                        I agree to the{' '}
                        <Text
                            style={styles.linkText}
                            onPress={() => alert('Chuyển hướng đến trang điều khoản')}>
                            Terms & Conditions
                        </Text>
                    </Text>
                </View>

                <View style={{
                    marginTop: 10,
                    alignItems: 'center',

                }} >
                    <Pressable
                        style={styles.button}
                        onPress={() => alert('Register')}>
                        <Text style={styles.buttonText}>
                            Create Account
                        </Text>
                    </Pressable>
                </View>

                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={[styles.text, { marginVertical: 10 }]}>
                        Or sign up with
                    </Text>
                    <View style={styles.containerGG_Apple}>
                        <Pressable
                            style={styles.buttonGG_Apple}
                            onPress={() => alert('Pressed')}>
                            <View style={styles.containerImageGG_Apple}>
                                <Image source={require('../../../assets/images/google-icon.png')}
                                    style={{ width: 20, height: 20, marginRight: 2 }}>
                                </Image>
                                <Text style={styles.buttonGG_AppleText}>
                                    Google
                                </Text>
                            </View>

                        </Pressable>

                        <Pressable
                            style={styles.buttonGG_Apple}
                            onPress={() => alert('Pressed')}>
                            <View style={styles.containerImageGG_Apple}>
                                <Image source={require('../../../assets/images/apple-icon.png')}
                                    style={{ width: 20, height: 20, marginRight: 2 }}>
                                </Image>
                                <Text style={styles.buttonGG_AppleText}>
                                    Apple
                                </Text>
                            </View>

                        </Pressable>
                    </View>
                    <Text style={[styles.text, { marginVertical: 10 }]}>
                        Already have an account? {''}
                        <Text style={styles.linkText}
                            onPress={() => navigation.navigate("Login")}>
                            Login
                        </Text>
                    </Text>
                </View>


            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1,
        justifyContent: 'center',
    },
    containerChild: {
        margin: 10,
        marginTop: 10,
        justifyContent: 'center',
        rowGap: 10
    },
    imageFrame: {
        width: 360,
        height: 180,
        borderWidth: 2,
        borderColor: "#ddd",
        backgroundColor: "#fff",
        borderRadius: 20,
        overflow: "hidden",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 50,
        margin: 10,
    },

    containerGG_Apple: {
        flexDirection: 'row',
        columnGap: 30,
    },
    checkbox: {
        marginRight: 10,
        width: 20,
        height: 20,
        borderRadius: 5,
        borderColor: '#ddd',
    },
    linkText: {
        color: '#00AEEF',
        fontWeight: '500',
    },
    containerImageGG_Apple: {
        flexDirection: 'row',
        columnGap: 10,
        alignItems: 'center'
    },
    buttonGG_Apple: {
        borderRadius: 8,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 40,

    },
    buttonGG_AppleText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#47CCF0',
        paddingVertical: 15,
        width: 350,
        borderRadius: 50, // Bo tròn hoàn toàn hai đầu
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    text: {
        color: '#7e7e7e',
        fontSize: 15,
        //  fontWeight: 'bold',
    }
})
