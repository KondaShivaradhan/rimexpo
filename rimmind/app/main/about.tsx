import { ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import {  AppVersion,classicDarkTheme, colortemp } from '../../misc/Constant'
import Status from '../../misc/Components/Status'
import WhiteText from '../../misc/Components/WhiteText'

const About = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <ScrollView style={styles.container}>

        <WhiteText>App version is {AppVersion}</WhiteText>
      </ScrollView>
      <Status></Status>
    </>
  )
}

export default About

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colortemp[0],
  },
  card: {
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    margin: 20,
    backgroundColor: colortemp[2]
  },
  pointsCon: {
    color: 'white',
    flexDirection: 'column'

  },
  version: {
    color: 'white',
    fontWeight: '900',
    fontSize: 24
  },

  points: {
    color: 'white',
    fontSize: 14,
    marginLeft:3,
    textAlignVertical: 'center',
    alignContent: 'center'
  }
});
