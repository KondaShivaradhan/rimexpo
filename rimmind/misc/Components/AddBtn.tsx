import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Link } from 'expo-router';
const AddBtn = () => {
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={()=>{console.log("presed")}} >
      {/* <Text style={styles.text}>Add</Text> */}
      <Link href="main/modal"> <Ionicons name="add" size={32} color="green" /></Link>
     
    </TouchableOpacity>
    </View>
  )
}

export default AddBtn

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        bottom:20,
        right:20,

    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 25,
        elevation: 3,
        backgroundColor: 'white',
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
})