import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtom } from 'jotai'
import { userAtom } from '../misc/atoms'
import AddBtn from '../misc/Components/AddBtn'
import WhiteText from '../misc/Components/WhiteText'
import { SafeAreaView } from 'react-native-safe-area-context'



const Dashboad: React.FC = () => {
    const router = useRouter
    const [ua, setusa] = useAtom(userAtom)
    const params = useLocalSearchParams();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <View style={styles.container}>
            </View>
            <AddBtn />
        </SafeAreaView>

    )
}

export default Dashboad

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: 20, // You can adjust this margin based on your design
        backgroundColor: 'black',
    },
})