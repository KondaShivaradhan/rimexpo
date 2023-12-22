import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WhiteText from './WhiteText'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { colortemp } from '../Constant'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { router } from 'expo-router'
interface TagsPros {
    tags: string[]
}
const Tags: React.FC<TagsPros> = ({ tags }) => {
    return (
        <View style={styles.container}>
            {tags.map((t,index) => (
                <TouchableOpacity onPress={()=>{
                    router.push({ pathname: 'main/analytics', params:{ tg:t} })
                }} key={index} style={styles.tagBox}>
                    <Text style={{color:'white'}}>{t}</Text>
                </TouchableOpacity>
            ))}

        </View>
    )
}

export default Tags

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        marginVertical:4
    },
    tagBox:{
        backgroundColor:colortemp[2],
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius:5,
    }
})