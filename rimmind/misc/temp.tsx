import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, useColorScheme, StatusBar, Pressable } from 'react-native';
import { GoogleSignin, User, statusCodes } from '@react-native-google-signin/google-signin';
import { Link, useNavigation, useRouter } from 'expo-router';
GoogleSignin.configure({
    webClientId: '50096351635-0vu6ql2llffp5ldpl4fv82heoshmf6c1.apps.googleusercontent.com',
    offlineAccess: true,
});

const Login: React.FC = () => {
    const router = useRouter()
    const navigation = useNavigation();
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
            router.push('afterlogin')
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


    return (
        <>
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>Welcome to Rimmind</Text>

                <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10 }} onPress={signIn} >
                    <Text>Sign In with Google</Text>
                </TouchableOpacity>
                <Link style={{ color: 'white' }} href={'/afterlogin'} asChild><Button title='Click me'></Button></Link>
            </View>
        </>

    )

};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'black'
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
