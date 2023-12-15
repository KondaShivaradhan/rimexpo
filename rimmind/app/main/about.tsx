import { ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { AppDetails, AppVersion, classicDarkTheme, colortemp } from '../../misc/Constant'
import Status from '../../misc/Components/Status'
import WhiteText from '../../misc/Components/WhiteText'
import { FlatList } from 'react-native-gesture-handler'

const About = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <ScrollView style={styles.container}>
        <Text style={{color:'white',fontSize:16,textAlign:'center',margin:20,}}>App version is {AppVersion}</Text>
        <View style={{padding:20}}>
          <Text style={{color:'white',fontSize:16,fontWeight:'bold',textAlign:'center',margin:15}}>Improvements</Text>
          {
            AppDetails[0].map((x, i) => (
              <WhiteText style={{margin:5}} key={i}>{x}</WhiteText>
            ))
          }
          <Text style={{color:'white',fontSize:16,fontWeight:'bold',textAlign:'center',margin:15}}>Not yet Fixed</Text>

          {
            AppDetails[1].map((x, i) => (
              <WhiteText style={{margin:5}} key={i}>{x}</WhiteText>
            ))
          }
        </View>
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
    marginLeft: 3,
    textAlignVertical: 'center',
    alignContent: 'center'
  }
});
