import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "../screens/SignUp";
import SignIn from "../screens/SignIn";
import Home from "../screens/Home";
import Account from "../screens/Account";
import Devices from "../screens/Devices";
import Note from "../screens/Notes";
import { AuthContext } from "../context/auth";
import HeaderTabs from "./header/HeaderTabs";
import {MQTTContext} from '../context/mqtt';

const Stack = createNativeStackNavigator();

const NavigationScreen = () => {
    const [state, setState] = useContext(AuthContext);
    const {client, status} = useContext(MQTTContext);

    const authenticated = (state && state.token !== '' && state.user !== null) && (status==='connected');
    return (
        <Stack.Navigator initialRouteName="Home">
            {authenticated ?
                (
                    <>
                        <Stack.Screen name="Home" component={Home} options={{ headerRight: () => <HeaderTabs /> }} />
                        <Stack.Screen name="Account" component={Account} />
                        <Stack.Screen name="Note" component={Note} />
                        <Stack.Screen name="Devices" component={Devices} />
                    </>

                ) : (
                    <>
                        <Stack.Screen name="SignIn" component={SignIn} />
                        <Stack.Screen name="SignUp" component={SignUp} />
                    </>
                )
            }
        </Stack.Navigator>
    )
}

export default NavigationScreen;