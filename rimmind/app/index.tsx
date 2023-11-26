import {  Platform, StyleSheet, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import {  useFonts ,Ubuntu_700Bold } from '@expo-google-fonts/ubuntu'
import {   Inter_900Black } from '@expo-google-fonts/inter'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { userAtom } from '../misc/atoms';
import { useAtom } from 'jotai';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import * as Notifications from 'expo-notifications';
SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize("9ff1670b-93a0-40eb-b6bf-d8c3ff2ea98a");

// Also need enable notifications to complete OneSignal setup
OneSignal.Notifications.requestPermission(true);
const Page = () => {
  const [Login, setLogin] = useState<React.ComponentType<any> | null>(null);
  const [LoginWeb, setLoginWeb] = useState<React.ComponentType<any> | null>(null);
  const [ua, setua] = useAtom(userAtom);
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync(); 
      }
    } catch (error) {
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }
  
  useEffect(() => {
    if(!__DEV__){
    onFetchUpdateAsync()

    }
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('UserStoredObj');
        if (value !== null) {
          // value previously stored
          console.log("displaying stored value");
          console.log(value); 
          setua(JSON.parse(value))
          router.push({ pathname: "main/dashbord", params: JSON.parse(value) })
        }
      } catch (e) {
        // error reading value
      }
    };
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to receive notifications was denied!');
      }
    };
  
    requestPermissions();
    getData()
    const loadLoginComponent = async () => {
      if (Platform.OS !== 'web') {
        const loginModule = require('./login');
        setLogin(() => loginModule.default);
      }
      else{
        const loginModule = require('./loginweb');
        setLoginWeb(() => loginModule.default);
      }
    };

    loadLoginComponent();
  }, [])
  let [fontsLoaded] = useFonts({
    Ubuntu_700Bold,
    Inter_900Black,
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded ) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  if (Platform.OS === 'web') {
    if(LoginWeb)
    return <LoginWeb />;
  } else if (Login) {
    return <Login />;
  } else {
    return <Text>Loading...</Text>;
  }
}

export default Page

const styles = StyleSheet.create({})