// = List files, create a binary file and read it = //

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
    GDrive,
    MimeTypes
} from "@robinbobin/react-native-google-drive-api-wrapper";
import React, { useEffect, useState } from 'react'
import { AppRegistry, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import Files from "../../misc/Components/Files";
import About from "../../misc/Components/About";
import Permissions from "../../misc/Components/Permissions";
// = Somewhere in your code = //
GoogleSignin.configure({
    webClientId: '50096351635-0vu6ql2llffp5ldpl4fv82heoshmf6c1.apps.googleusercontent.com',
    offlineAccess: true, scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.appfolder',
    ],
});

const driveUp = () => {
    const [gdrive, setGDrive] = useState<GDrive>()
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '50096351635-0vu6ql2llffp5ldpl4fv82heoshmf6c1.apps.googleusercontent.com',
            offlineAccess: true,
            // scopes: [
            //     'https://www.googleapis.com/auth/drive',
            //     'https://www.googleapis.com/auth/drive.appfolder',
            // ],
        })

        const init = async () => {
            try {
                await GoogleSignin.signIn()

                const gdrv = new GDrive()

                gdrv.accessToken = (await GoogleSignin.getTokens()).accessToken

                gdrv.fetchCoercesTypes = true
                gdrv.fetchRejectsOnHttpErrors = true
                gdrv.fetchTimeout = 3000

                setGDrive(gdrv)
                console.log(gdrv);

            } catch (error) {
                console.log(error)
            }
        }

        init()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.apiContainer}>
                <About gdrive={gdrive} />
                <Files gdrive={gdrive} />
                <Permissions gdrive={gdrive} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default driveUp

const styles = StyleSheet.create({
    apiContainer: {
        marginBottom: 20,
    },
    container: {
        backgroundColor: '#2e2e2e',
        flex: 1,
        paddingHorizontal: 25,
    },
})
