import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, useColorScheme, StatusBar, Pressable } from 'react-native';
import { GoogleSignin, User, statusCodes } from '@react-native-google-signin/google-signin';
import { Link, useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import { statusAtom, userAtom } from '../misc/atoms';
import { UserInterface } from '../misc/interfaces';
import { AntDesign } from '@expo/vector-icons';
import Status from '../misc/Components/Status';

GoogleSignin.configure({
    webClientId: '50096351635-0vu6ql2llffp5ldpl4fv82heoshmf6c1.apps.googleusercontent.com',
    offlineAccess: true,
});
const Login: React.FC = () => {

    const [ua, setusa] = useAtom(userAtom)

    const router = useRouter()
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
    }, [])

    const signIn = async () => {
        console.log("came to Google Login");

        try {
            await GoogleSignin.hasPlayServices();
            const user = await GoogleSignin.signIn();
            setUserInfo(user);
            const updatedUser: UserInterface = {
                email: user.user.email,
                name: `${user.user.name}`,
                photo: `${user.user.photo}`,
            };

            setusa(updatedUser)
            router.push({ pathname: "main/dashbord", params: user.user })
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



    const [sa, setsa] = useAtom(statusAtom)

    return (
        <>
            <View style={styles.container}>
                <Image source={require('../assets/icon.png')} style={{ height: 300, width: 400 }} height={100} width={100} />
                <View style={styles.container2}>
                    <Text style={{ color: 'white', fontFamily: 'Inter_900Black', fontSize: 30 }}>Welcome to </Text>
                    <Text style={{ color: 'white', fontFamily: 'Ubuntu_700Bold', fontSize: 60 }}>Rimmind</Text>
                    <TouchableOpacity style={styles.googleSignInBtn} onPress={signIn}>
                        <AntDesign name="google" size={24} color="white" />
                        <Text style={styles.googleSignInText}>Sign In with Google</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Status />
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
    container2: {
        alignItems: 'center',
        marginTop: -40,
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    googleSignInBtn: {
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center',
        backgroundColor: '#4285f4', // Google Blue
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    googleSignInText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Login;
