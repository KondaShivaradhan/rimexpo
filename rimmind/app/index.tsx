import React, {  useEffect, useRef, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { userAtom } from '../misc/atoms';
import { useAtom } from 'jotai';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { urls } from '../misc/Constant';
import LottieView from 'lottie-react-native';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { useFonts, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu'
import { Inter_900Black } from '@expo-google-fonts/inter'
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

const Page:React.FC<DrawerHeaderProps> = ({navigation}) => {
  let [fontsLoaded] = useFonts({
    Ubuntu_700Bold,
    Inter_900Black,
  });
  const animation = useRef(null);
  const [ua, setua] = useAtom(userAtom);

  const test = () => {
    router.push({ pathname: "caution" });
  };

  const getVerion = async () => {
    console.log('Fetching version...');
    try {
      const recordsResponse = await axios.get(urls.getVersion);
      console.log(recordsResponse.data);
      return recordsResponse.data.status;
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  };

  const onFetchUpdateAsync = async () => {
    console.log('Checking for updates...');
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('Error fetching latest Expo update:', error);
    }
  };

  const getData = async () => {
    console.log('Getting data from storage...');
    try {
      const value = await AsyncStorage.getItem('UserStoredObj');
      if (value !== null) {
        console.log("Found stored value");
        setua(JSON.parse(value));
        router.push({ pathname: "main/dashbord" , params: JSON.parse(value) });
      }
      else{
        router.push({ pathname: "login" });
      }
    } catch (e) {
      console.error('Error reading value from storage:', e);
    }
  };


 
  
  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to receive notifications was denied!');
    }
  };
  
  const screenHeight = Dimensions.get('window').height;
  useEffect(() => {
    
    const fetchData = async () => {
      if (!__DEV__) {
        await onFetchUpdateAsync();
      }
      
      const versionData = await getVerion();
      if (versionData) {
        await getData();
      } else {
        test();
      }

      requestPermissions();
    };

    fetchData();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      console.log('came index');
      getData()
    }, [navigation])
  )
return <>
<View style={styles.animationContainer}>
  <Image source={require('../assets/splash.png')}    style={{ height: screenHeight, width: '100%', resizeMode: 'cover' }}></Image>
    </View>
</>

};

export default Page;
const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});
// SplashScreen.preventAutoHideAsync();
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// OneSignal.Debug.setLogLevel(LogLevel.Verbose);
// OneSignal.initialize("9ff1670b-93a0-40eb-b6bf-d8c3ff2ea98a");

// OneSignal.Notifications.requestPermission(true);
// const Page = () => {
//   const [appIsReady, setAppIsReady] = useState(false);
//   const [ua, setua] = useAtom(userAtom);
//   const test = () => {
//     router.push({ pathname: "caution" })
//   }
//   const getVerion = async () => {
//     console.log('im get version');

//     try {
//       const recordsResponse = await axios.get(urls.getVersion);
//       console.log(recordsResponse.data);
//       return recordsResponse.data.status
//     } catch (error) {
//       console.error('Error fetching version:', error);
//     }
//   };
//   async function onFetchUpdateAsync() {
//     console.log('im get update');
//     try {
//       const update = await Updates.checkForUpdateAsync();

//       if (update.isAvailable) {
//         await Updates.fetchUpdateAsync();
//         await Updates.reloadAsync();
//       }
//     } catch (error) {
//       alert(`Error fetching latest Expo update: ${error}`);
//     }
//   }
//   const getData = async () => {
//     console.log('im get data');

//     try {
//       const value = await AsyncStorage.getItem('UserStoredObj');
//       if (value !== null) {
//         // value previously stored
//         console.log("Found stored value");
//         setua(JSON.parse(value))
//         router.push({ pathname: "main/dashbord", params: JSON.parse(value) })
//       }
//     } catch (e) {
//       // error reading value
//     }
//   };

//   const requestPermissions = async () => {
//     const { status } = await Notifications.requestPermissionsAsync();
//     if (status !== 'granted') {
//       console.error('Permission to receive notifications was denied!');
//     }
//   };
//   useEffect(() => {

//     if (!__DEV__) {
//       onFetchUpdateAsync()
//     }
//     getVerion().then((data) => {
//       console.log(data);

//       if (data) {
//         getData()
//       }
//       else {
//         test()
//       }
//       requestPermissions();
//       // loadLoginComponent();
//     })

//   }, [])
//   let [fontsLoaded] = useFonts({
//     Ubuntu_700Bold,
//     Inter_900Black,
//   });


  
// }

// export default Page

