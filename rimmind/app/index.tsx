import { Button, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen';
import Login from './login'
import {atom} from 'jotai'
import * as Updates from 'expo-updates';
import {  useFonts ,Ubuntu_700Bold } from '@expo-google-fonts/ubuntu'
import {   Inter_900Black } from '@expo-google-fonts/inter'
SplashScreen.preventAutoHideAsync();

const Index:React.FC = () => {
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }
  useEffect(() => {
    onFetchUpdateAsync()
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
    return (
    <Login></Login>
  )
}

export default Index

const styles = StyleSheet.create({})