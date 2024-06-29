import { StyleSheet, Text, SafeAreaView, View, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import FooterList from "../components/footer/FooterList";
import axios from 'axios';
import { DeviceContext } from "../context/device";
import { MQTTContext } from "../context/mqtt";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Devices = ({ navigation }) => {
    const [device, setDevice] = useState('');
    const [devices, setDevices] = useContext(DeviceContext);
    const [isEnabled, setIsEnabled] = useState(true);
    const {client} = useContext(MQTTContext);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        const { data } = await axios.get('http://192.168.0.105:8000/api/get-device');
        const devicesWithSwitchState = data.map(device => ({ ...device, isEnabled: false }));
        setDevices(devicesWithSwitchState);
    }
    const handleSubmit = async () => {
        if (device === '') {
            alert("Enter device name");
            return;
        }
        try {
            const { data } = await axios.post('http://192.168.0.105:8000/api/add-device',
                { device }
            );
            console.log('data => ', data);
            const newDevice = { ...data, isEnabled: false };
            setDevices([newDevice, ...devices]);
            setTimeout(() => {
                alert("Add device successfully");
            }, 500);
            setDevice('');
        } catch (err) {
            console.log(err);
        }
    }

    const sendMessage = (_, isEnabled, deviceName) => {
        const msg = isEnabled ? 'bat' : 'tat';
        // Gửi message qua MQTT
        if (client.isConnected()) {
            const message = new Paho.MQTT.Message(String(msg));
            message.destinationName = `${deviceName}`;
            client.send(message);
        } else {
            console.log("Client is not connected");
        }
    }

    const toggleSwitch = (id, deviceName) => {
        const updatedDevices = devices.map(device => {
            if (device._id === id) {
                const newIsEnabled = !device.isEnabled;
                sendMessage(id, newIsEnabled, deviceName);
                return { ...device, isEnabled: newIsEnabled };
            }
            return device;
        });
        setDevices(updatedDevices);
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.mainText}>DEVICES LIST</Text>
                <View style={{ marginHorizontal: 24 }}>
                    <Text style={{ fontSize: 16, color: '#151b54', marginTop: 5 }}>DEVICE NAME</Text>
                    <TextInput style={styles.signupInput} value={device} onChangeText={text => setDevice(text)} autoCapitalize="none" autoCorrect={false} placeholder="Enter device name" />
                </View>
                <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
                    <Text style={styles.buttonText}>Add new device</Text>
                </TouchableOpacity>

                {devices && devices.map(item => (
                    <View key={item._id} style={{ alignItems: 'center' }}>
                        <View style={styles.box}>
                            <View style={{ padding: 5, height: 50 }}>
                                <Text style={styles.deviceText}>{item.device}</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={item.isEnabled ? '#151b54' : '#fff'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => toggleSwitch(item._id, item.device)}
                                value={item.isEnabled}
                            />
                        </View>
                    </View>
                ))}
            </ScrollView>
            <FooterList />
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    mainText: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10
    },
    signupInput: {
        borderBottomWidth: 0.5,
        height: 48,
        borderBottomColor: 'black',
        marginBottom: 30,
        marginTop: 5
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
    box: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '80%'
    },
    deviceText: {
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 20,
        fontWeight: 'semibold',
        color: '#171717'
    },
})

export default Devices;