import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View style={{ marginVertical: 100 }}>
                <View style={styles.imageContainer}>
                    <Image source={require('../assets/logo.png')} style={styles.imageStyle} />
                </View>
                <Text style={styles.signupText}>Forgot Password</Text>
                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontSize: 16, color: 'black' }}>EMAIL</Text>
                    <TextInput style={styles.signupInput} value={email} onChangeText={text => setEmail(text)} autoComplete="email" keyboardType="email-address" placeholder="Enter your email here" />
                </View>
                <TouchableOpacity style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, textAlign: 'center' }}>Already Joined? {" "}
                    <Text style={{ color: '#4169e1', fontWeight: 'bold' }} onPress={() => navigation.navigate('SignIn')}>Sign In</Text>
                </Text>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    signupText: {
        fontSize: 30,
        textAlign: 'center'
    },
    signupInput: {
        borderBottomWidth: 0.5,
        height: 48,
        borderBottomColor: 'black',
        marginBottom: 30,
    },
    buttonStyle: {
        backgroundColor: '#4169e1',
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        marginHorizontal: 15,
        borderRadius: 15
    },
    buttonText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#fff',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageStyle: {
        width: 200,
        height: 200,
        marginVertical: 20
    }
})

export default ForgotPassword;