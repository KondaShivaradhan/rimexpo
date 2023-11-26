import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { router } from 'expo-router';

const Logout = () => {

  const signOut = async () => {
    try {
      // await GoogleSignin.signOut();
      
      router.replace('/')
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    signOut()
  },)

  return null;
}

export default Logout

const styles = StyleSheet.create({})