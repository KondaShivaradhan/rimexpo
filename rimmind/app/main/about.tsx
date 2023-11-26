import { ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Allvers, classicDarkTheme, colortemp } from '../../misc/Constant'
import Status from '../../misc/Components/Status'

const About = () => {
  const datatoLoad = Allvers
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <ScrollView style={styles.container}>

        {
          datatoLoad.map((e, index) => (
            <View style={styles.card} key={index}>
              <Text style={{ flexDirection: 'row', gap: 15, flexWrap: 'nowrap' }}>
                <Text style={styles.version}>{e.ver}
                </Text>
                {
                  (e.current) ?
                    <Text style={{ color: '#ffdc5d' }}>  latest</Text>
                    :
                    // <Text style={{color:'#ff685d'}}>  decapriated</Text>
                    null
                }
              </Text>
              <View style={styles.pointsCon}>
                {e.points.map((x, i) => (
                  <View style={{ flexDirection: 'row', flexWrap: 'nowrap', alignContent: 'center' }} key={i}>
                    <Text style={{ fontWeight: '900',color:colortemp[3] }}>* </Text>
                    <Text style={styles.points} > {x}</Text>

                  </View>
                ))}
              </View>
            </View>
          ))
        }
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
