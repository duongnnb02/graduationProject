import React from "react";
import { createContext, useState, useEffect } from "react";
import init from 'react_native_mqtt';
import AsyncStorage from "@react-native-async-storage/async-storage";

init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync: {},
});

const options = {
    host: 'broker.emqx.io',
    port: 8083,
    path: '/testTopic',
    id: 'id_' + parseInt(Math.random() * 100000),
};

const MQTTContext = createContext();

const MQTTProvider = ({ children }) => {
    const [client, setClient] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const newClient = new Paho.MQTT.Client(options.host, options.port, options.path);

        const onConnect = () => {
            console.log('onConnect');
            setStatus('connected');
        }

        const onFailure = () => {
            console.log('Connect failed');
            console.log(err);
            setStatus('failed');
        }

        const onConnectionLost = (responseObject) => {
            if (responseObject.errorCode !== 0) {
                console.log('onConnectionLost:' + responseObject.errorMessage);
            }
        };

        const onMessageArrived = (message) => {
            console.log('onMessageArrived:' + message.payloadString);
        };

        newClient.connect({
            onSuccess: onConnect,
            useSSL: false,
            timeout: 3,
            onFailure: onFailure,
        });

        newClient.onConnectionLost = onConnectionLost;
        newClient.onMessageArrived = onMessageArrived;

        setClient(newClient);

        return () => {
            if (newClient) {
                newClient.disconnect();
            }
        };
    }, []);

    return (
        <MQTTContext.Provider value={{client, status}} >
            {children}
        </MQTTContext.Provider>
    );
};

export {MQTTContext, MQTTProvider};