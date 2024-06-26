import { StyleSheet, Text, SafeAreaView, View, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import FooterList from "../components/footer/FooterList";
import {AuthContext} from '../context/auth';
import axios from 'axios';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Account = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [state, setState] = useContext(AuthContext);

    useEffect(() => {
        if (state) {
            const {name, email, role} = state.user;
            setName(name);
            setEmail(email);
            setRole(role);
        }
    }, [state]);

    const handleSubmit = async () => {
        try {
            let storedData = await AsyncStorage.getItem('auth-rn');
            const user = JSON.parse(storedData);
            console.log(user);
            const res = await axios.post('http://172.20.10.3:8000/api/update-password', {password, user});
            const data = res.data;
            if (data.error) alert(data.error);
            else {
                alert('Password updated successfully!');
                setPassword('');
            }
        } catch (err) {
            alert('Password update failed!');
            console.error(err);
        }
    }
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <ScrollView style={{ marginVertical: 10 }}>
                <View style={styles.imageContainer}>
                    <Image source={require('../assets/logo.png')} style={styles.imageStyle} />
                </View>
                <Text style={styles.signupText}>{name}</Text>
                <Text style={styles.emailText}>{email}</Text>
                <Text style={styles.roleText}>{role}</Text>
                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontSize: 16, color: 'black' }}>PASSWORD</Text>
                    <TextInput style={styles.signupInput} value={password} onChangeText={text => setPassword(text)} secureTextEntry={true} autoComplete="password" />
                </View>
                <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>Update Password</Text>
                </TouchableOpacity>
            </ScrollView>
            <FooterList />
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
    emailText: {
        fontSize: 18,
        textAlign: 'center',
        paddingBottom: 10
    },
    roleText: {
        fontSize: 16,
        textAlign: 'center',
        paddingBottom: 10,
        color: 'gray'
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

export default Account;