import { BackHandler, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import axios from 'axios';
import { urls } from '../misc/Constant';

const Caution:React.FC = () => {
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          // Prevent going back
          return true;
        });
    
        return () => {
          // Clean up the event listener when the component unmounts
          backHandler.remove();
        };
      }, []);
    const test = async () => {
        console.log('came here');

        const fetchAPK = await axios.get(urls.getAPK)
        await Linking.openURL(fetchAPK.data)
    }
    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <Text style={styles.title}>Wrong Version</Text>
                <Text style={styles.message}>
                    This version of the app is outdated. Please download the latest version.
                </Text>
                <TouchableOpacity style={styles.button} onPress={test}>
                    <Text style={styles.buttonText}>Download Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Caution


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        backgroundColor: '#202020', // Adjust the background color as needed
    },
    container2: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#202020', // Adjust the background color as needed
    },
    title: {
        color: '#f39f20',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    message: {
        color: '#d8d7d6',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#3498db', // Button color
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff', // Button text color
        fontSize: 18,
        fontWeight: 'bold',
    },
});