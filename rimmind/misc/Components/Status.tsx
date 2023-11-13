import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import WhiteText from './WhiteText'
import { useAtom } from 'jotai'
import { statusAtom } from '../atoms'

const Status = () => {

const [sa,setsa]=useAtom(statusAtom)
// useEffect(() => {
//     setTimeout(() => {
//         setsa({status:""})
//     }, 3000);
// }, [sa])

return (
    <View style={styles.container}>
      <WhiteText>{sa.status}</WhiteText>
    </View>
  )
}

export default Status

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        bottom:0,

    }
})