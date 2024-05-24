/* @flow */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { Input, Button } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';

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

// Create client instance
const client = new Paho.MQTT.Client(options.host, options.port, options.path);

const App = () => {
  const [topic, setTopic] = useState('');
  const [subscribedTopic, setSubscribedTopic] = useState('');
  const [messageToSend, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [status, setStatus] = useState('');

  const messageListRef = useRef(null);

  useEffect(() => {
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
  }, []);

  const onConnect = () => {
    console.log('onConnect');
    setStatus('connected');
  };

  const onFailure = (err) => {
    console.log('Connect failed!');
    console.log(err);
    setStatus('failed');
  };

  const connect = () => {
    setStatus('isFetching');
    client.connect({
      onSuccess: onConnect,
      useSSL: false,
      timeout: 3,
      onFailure: onFailure,
    });
  };

  const onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  };

  const onMessageArrived = (message) => {
    console.log('onMessageArrived:' + message.payloadString);
    setMessageList((prevMessageList) => [message.payloadString, ...prevMessageList]);
  };

  const subscribeTopic = () => {
    setSubscribedTopic(topic);
    client.subscribe(topic, { qos: 0 });
  };

  const unSubscribeTopic = () => {
    client.unsubscribe(subscribedTopic);
    setSubscribedTopic('');
  };

  const sendMessage = () => {
    console.log(client._getClientId());
    if(client.isConnected()){
      console.log('client ....')
    }
    const message = new Paho.MQTT.Message(messageToSend);
    message.destinationName = subscribedTopic;
    client.send(message);
  };

  const renderRow = ({ item }) => {
    const idMessage = item.split(':');
    return (
      <View
      style={[
          styles.componentMessage,
          idMessage[0] === options.id
            ? styles.myMessageComponent
            : idMessage.length === 1
              ? styles.introMessage
              : styles.messageComponent,
        ]}
      >
        <Text style={idMessage.length === 1 ? styles.textIntro : styles.textMessage}>
          {item}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          marginBottom: 50,
          textAlign: 'center',
          color: status === 'connected' ? 'green' : 'black',
        }}
      >
        ClientID: {options.id}
      </Text>
      {status === 'connected' ? (
        <View>
          <Button
            type='solid'
            title='DISCONNECT'
            onPress={() => {
              client.disconnect();
              setStatus('');
              setSubscribedTopic('');
            }}
            buttonStyle={{ marginBottom: 50, backgroundColor: '#397af8' }}
            icon={{ name: 'lan-disconnect', type: 'material-community', color: 'white' }}
          />
          <View style={{ marginBottom: 30, alignItems: 'center' }}>
            <Input
              label='TOPIC'
              placeholder=''
              value={topic}
              onChangeText={setTopic}
              disabled={!!subscribedTopic}
            />
            {subscribedTopic ? (
              <Button
                type='solid'
                title='UNSUBSCRIBE'
                onPress={unSubscribeTopic}
                buttonStyle={{ backgroundColor: '#397af8' }}
                icon={{ name: 'link-variant-off', type: 'material-community', color: 'white' }}
              />
            ) : (
              <Button
                type='solid'
                title='SUBSCRIBE'
                onPress={subscribeTopic}
                buttonStyle={{ backgroundColor: '#397af8' }}
                icon={{ name: 'link-variant', type: 'material-community', color: 'white' }}
                disabled={!topic || !!topic.match(/ /)}
              />
            )}
          </View>
          {subscribedTopic && (
            <View style={{ marginBottom: 30, alignItems: 'center' }}>
              <Input
                label='MESSAGE'
                placeholder=''
                value={messageToSend}
                onChangeText={setMessage}
              />
              <Button
                type='solid'
                title='PUBLISH'
                onPress={sendMessage}
                buttonStyle={{ backgroundColor: status === 'failed' ? 'red' : '#397af8' }}
                icon={{ name: 'send', color: 'white' }}
                disabled={!messageToSend || !!messageToSend.match(/^[ ]*$/)}
              />
            </View>
          )}
        </View>
      ) : (
        <Button
          type='solid'
          title='CONNECT'
          onPress={connect}
          buttonStyle={{
            marginBottom: 50,
            backgroundColor: status === 'failed' ? 'red' : '#397af8',
          }}
          icon={{ name: 'lan-connect', type: 'material-community', color: 'white' }}
          loading={status === 'isFetching'}
          disabled={status === 'isFetching'}
        />
      )}
      <View style={styles.messageBox}>
        <FlatList
          ref={messageListRef}
          data={messageList}
          renderItem={renderRow}
          keyExtractor={(item, index) => item + index}
          extraData={messageList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
  },
  messageBox: {
    margin: 16,
    flex: 1,
  },
  myMessageComponent: {
    backgroundColor: '#000000',
    borderRadius: 3,
    padding: 5,
    marginBottom: 5,
  },
  messageComponent: {
    marginBottom: 5,
    backgroundColor: '#0075e2',
    padding: 5,
    borderRadius: 3,
  },
  introMessage: {},
  textIntro: {
    color: 'black',
    fontSize: 12,
  },
  textMessage: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;