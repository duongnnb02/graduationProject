import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useState, useContext } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/auth";

const SignIn = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [state, setState] = useContext(AuthContext);

    const handleSubmit = async () => {
        if (email === '' || password === '') {
            alert('All fields are required');
            return;
        }
        const res = await axios.post('http://192.168.0.105:8000/api/signin', {email, password })
        if (res.data.error)
            console.log(res.data.error);
        else {
            setState(res.data)
            await AsyncStorage.setItem('auth-rn', JSON.stringify(res.data));
            alert("Sign In Successful");
            navigation.navigate('Home');
        }
    }
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <View style={{ marginVertical: 100 }}>
                <View style={styles.imageContainer}>
                    <Image source={require('../assets/logo.png')} style={styles.imageStyle} />
                </View>
                <Text style={styles.signInText}>SignIn</Text>
                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontSize: 16, color: 'black' }}>EMAIL</Text>
                    <TextInput style={styles.signInInput} value={email} onChangeText={text => setEmail(text)} autoComplete="email" keyboardType="email-address" />
                </View>
                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontSize: 16, color: 'black' }}>PASSWORD</Text>
                    <TextInput style={styles.signInInput} value={password} onChangeText={text => setPassword(text)} secureTextEntry={true} autoComplete="password" />
                </View>
                <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, textAlign: 'center' }}>Not yet registered? {" "}
                    <Text style={{ color: '#4169e1', fontWeight: 'bold' }} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text>
                </Text>
                <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>Forgot Password?</Text>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    signInText: {
        fontSize: 30,
        textAlign: 'center'
    },
    signInInput: {
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

export default SignIn;