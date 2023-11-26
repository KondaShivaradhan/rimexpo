import { Image, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import WhiteText from '../../misc/Components/WhiteText'
import { Link } from 'expo-router'
import { useAtom } from 'jotai'
import { recordsAtom, userAtom } from '../../misc/atoms'
import { colortemp } from '../../misc/Constant'

const profile = () => {
    const [recordsA, setARecords] = useAtom(recordsAtom)
    console.log(recordsA);
    const [ua, setua] = useAtom(userAtom);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <View style={styles.container}>
                <View style={styles.profile}>
                    <Image source={{ uri: ua.photo }} style={styles.userImage} />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{ua.name}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userEmail}>{ua.email}</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default profile


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    route: {
        margin: 10,
        backgroundColor:'white' ,
        paddingVertical: 15,
        paddingHorizontal: 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
      },
      profile: {
        flexDirection: 'column',
        justifyContent:'flex-start',
        paddingVertical:10,
        paddingHorizontal:5,
        alignItems: 'center', // Align children vertically in the center
        gap:5,
      },
      userInfo: {
        // Add some margin between text and image
      },
      userName: {
        textAlign:'center',
        color:colortemp[4],
        fontSize: 18,
        fontWeight: 'bold',
      },
      userEmail: {
        fontSize: 14,
        color:colortemp[4],
    
      },
      userImage: {
        width: 200,
        height: 200,
        borderRadius: 25, // Make it a circle
      },
})