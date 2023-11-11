import { Button, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import Login from './login'
import {atom} from 'jotai'
const Index:React.FC = () => {
    
    return (
    <Login></Login>
  )
}

export default Index

const styles = StyleSheet.create({})