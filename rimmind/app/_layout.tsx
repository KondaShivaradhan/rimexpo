import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const StackLayout = () => {
  return (
    <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: '#f4511e',
        
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerShown:false
    }}>
        <Stack.Screen name="index" ></Stack.Screen>
        <Stack.Screen name="login" ></Stack.Screen>
        <Stack.Screen name="dashbord" ></Stack.Screen>
    </Stack>
  )
}

export default StackLayout