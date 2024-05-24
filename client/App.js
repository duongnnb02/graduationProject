import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import Home from './screens/Home';
import { AuthProvider } from './context/auth'
import Navigation from './components/Navigation';

export default function App() {
  return (
    <Navigation />
  );
}
