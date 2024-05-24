import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import NavigationScreen from "./NavigationScreen";
import { AuthProvider } from "../context/auth";
import { DeviceProvider } from "../context/device";
import { MQTTProvider } from "../context/mqtt";

const Navigation = () => {
    return (
        <NavigationContainer>
            <AuthProvider>
                <MQTTProvider>
                    <DeviceProvider>
                        <NavigationScreen />
                    </DeviceProvider>
                </MQTTProvider>
            </AuthProvider>
        </NavigationContainer>
    )
}

export default Navigation;