import { Button, SafeAreaView, SafeAreaViewComponent, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DrawerHeaderProps } from '@react-navigation/drawer'

const Header:React.FC<DrawerHeaderProps> = ({navigation}) => {
  return (
    
    <View style={{marginTop:20}}>
   

        <Button title='click for header' onPress={()=>{navigation.openDrawer()}}></Button>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({})