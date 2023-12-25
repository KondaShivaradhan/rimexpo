import { StyleSheet, Text, View } from 'react-native'
import React, { ReactNode } from 'react'
import { AntDesign } from '@expo/vector-icons';
interface CringeProps {
    text:string
    children?: ReactNode;
}

const Cringe:React.FC<CringeProps> = ({children,text}) => {
  return (
    <View style={[styles.card,{}]}>
        <AntDesign name="warning" size={16} color="black" />
      <Text style={{color:'black'}}>{text}</Text>
      <Text >
      {children}
    </Text>
    </View>
  )
}

export default Cringe

const styles = StyleSheet.create({
    card:{
        borderRadius:12,
        elevation:10,
        backgroundColor:'#ffeb7c',
        padding:10,
        flexDirection:'row',
        gap:3,
    }
})