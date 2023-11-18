import {  Platform, StyleSheet, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import {  useFonts ,Ubuntu_700Bold } from '@expo-google-fonts/ubuntu'
import {   Inter_900Black } from '@expo-google-fonts/inter'
SplashScreen.preventAutoHideAsync();

const Page = () => {
  const [Login, setLogin] = useState<React.ComponentType<any> | null>(null);
  const [LoginWeb, setLoginWeb] = useState<React.ComponentType<any> | null>(null);
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
    // onFetchUpdateAsync()

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