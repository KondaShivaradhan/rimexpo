import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, useColorScheme, StatusBar } from 'react-native';
import { GoogleSignin, GoogleSigninButton, User, statusCodes } from '@react-native-google-signin/google-signin';
import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
GoogleSignin.configure({
    webClientId: '50096351635-0vu6ql2llffp5ldpl4fv82heoshmf6c1.apps.googleusercontent.com',
    offlineAccess: true,
});

const Login: React.FC= () => {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const checkSignInStatus = async () => {
        try {
            const isSignedIn = await GoogleSignin.isSignedIn();
            if (isSignedIn) {
            } else {
                setUserInfo(null);
            }
        } catch (error) {
            console.error('Error checking sign-in status:', error);
        }
    };
    useEffect(() => {

        checkSignInStatus()
    })

    const signIn = async () => {
        console.log("came to Google Login");

        try {
            await GoogleSignin.hasPlayServices();
            const user = await GoogleSignin.signIn();
            console.log(user)
            setUserInfo(user);
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
                console.error(error);
            }
        }
    };

    const signOut = async () => {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setUserInfo(null);
        } catch (error) {
            console.error(error);
        }
    };
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1,
    };

    return (
        <>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <View style={styles.container}>
                <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10 }} onPress={signIn} >
                    <Text>Sign In with Google</Text>
                </TouchableOpacity>

            </View>
        </>

    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    googleSignInButton: {
        width: 192,
        height: 48,
    },
});

export default Login;
