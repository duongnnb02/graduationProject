import { TouchableOpacity, SafeAreaView, Button, Text } from "react-native";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HeaderTabs = () => {
    const [state, setState] = useContext(AuthContext);

    const signOut = async () => {
        setState({ token: '', user: null });
        await AsyncStorage.removeItem('auth-rn');
    };

    return (
        <SafeAreaView>
            <TouchableOpacity onPress={signOut} style={{
                backgroundColor: 'black',
                justifyContent: 'center',
                borderRadius: 10,
                height: 40,
                width: 90
            }}>
                <Text style={{
                    textAlign: 'center',
                    color: '#fff',
                    textTransform: 'uppercase',
                }}>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default HeaderTabs;