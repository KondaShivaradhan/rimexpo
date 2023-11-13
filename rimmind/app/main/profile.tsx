import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import WhiteText from '../../misc/Components/WhiteText'
import { Link } from 'expo-router'

const profile = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <View style={styles.container}>
                <WhiteText>This is the Profile</WhiteText>
                <Link href={{ pathname: 'dashbord', params: { name: 'Bacon' } }}>Go to Details</Link>
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
})