import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { User } from '../misc/interfaces'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { atom, useAtom } from 'jotai'
import { mangaAtom } from '../misc/atoms'



const Dashboad:React.FC = () => {
    const router = useRouter
    const [ua, setusa] = useAtom(mangaAtom)
    const params = useLocalSearchParams();
    return (

        <View style={{ flex: 1, marginTop: 20, }}>
            <Text>Dashboard</Text>
            <Text>{JSON.stringify(ua)}</Text>
        </View>

    )
}

export default Dashboad

const styles = StyleSheet.create({})