import React from 'react'
import { Stack } from 'expo-router'
import { RootSiblingParent } from 'react-native-root-siblings';
const StackLayout = () => {
  return (
    <RootSiblingParent> 
    <Stack
      screenOptions={{

        headerStyle: {
          backgroundColor: '#f4511e',

        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false
      }}>
      <Stack.Screen name="index" options={{headerShown:false}}  ></Stack.Screen>
      <Stack.Screen name="login" ></Stack.Screen>
      <Stack.Screen name="caution" ></Stack.Screen>
{/* 
      <Stack.Screen name="dashbord" ></Stack.Screen>
      <Stack.Screen name="modal" ></Stack.Screen>
      <Stack.Screen name="editrecord"  ></Stack.Screen> */}

    </Stack>
    </RootSiblingParent> 
  )
}

export default StackLayout