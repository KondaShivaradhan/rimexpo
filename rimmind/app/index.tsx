import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import { useFonts, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu'
import { Inter_900Black } from '@expo-google-fonts/inter'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { userAtom } from '../misc/atoms';
import { useAtom } from 'jotai';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { urls } from '../misc/Constant';
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

OneSignal.Notifications.requestPermission(true);
const Page = () => {
  const [Login, setLogin] = useState<React.ComponentType<any> | null>(null);
  const [LoginWeb, setLoginWeb] = useState<React.ComponentType<any> | null>(null);
  const [ua, setua] = useAtom(userAtom);
  interface CautionScreenProps {
    onDownloadPress: () => void;
  }

  const CautionScreen: React.FC<CautionScreenProps> = ({ onDownloadPress }) => {
    return (
      <View style={styles.container}>
        <View style={styles.container2}>
          <Text style={styles.title}>Wrong Version</Text>
          <Text style={styles.message}>
            This version of the app is outdated. Please download the latest version.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onDownloadPress}>
            <Text style={styles.buttonText}>Download Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const test = () => {
    router.push({ pathname: "caution" })
  }
  const getVerion = async () => {
    console.log('im get version');

    try {
      const recordsResponse = await axios.get(urls.getVersion);
      console.log(recordsResponse.data);
      return recordsResponse.data.status
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  };
  async function onFetchUpdateAsync() {
    console.log('im get update');

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
  const getData = async () => {
    console.log('im get data');

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
  const loadLoginComponent = async () => {
    console.log('im get login');

    if (Platform.OS !== 'web') {
      const loginModule = require('./login');
      setLogin(() => loginModule.default);
    }
    else {

      const loginModule = require('./loginweb');
      setLoginWeb(() => loginModule.default);
      return null;
    }
  };
  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to receive notifications was denied!');
    }
  };
  useEffect(() => {

    if (!__DEV__) {
      onFetchUpdateAsync()
    }
    getVerion().then((data) => {
      console.log(data);

      if (data) {
        getData()
      }
      else {
        test()
      }
      requestPermissions();
      loadLoginComponent();
    })



  }, [])
  let [fontsLoaded] = useFonts({
    Ubuntu_700Bold,
    Inter_900Black,
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);


  if (!fontsLoaded) {
    return null;
  }
  if (Platform.OS === 'web') {
    if (LoginWeb)
      return <LoginWeb />;
  } else if (Login) {

    return <Login />;
  } else {
    return <Text>Loading...</Text>;
  }
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020', // Adjust the background color as needed
  },
  container2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020', // Adjust the background color as needed
  },
  title: {
    color: '#f39f20',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    color: '#d8d7d6',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3498db', // Button color
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff', // Button text color
    fontSize: 18,
    fontWeight: 'bold',
  },
});