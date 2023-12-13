import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import CryptoJS from "react-native-crypto-js";
import { Decrypt, Encrypt } from '../../misc/Constant';


export default function App() {
  useEffect(() => {
    const hashData = async () => {
      const ciper =  Encrypt("this is fun","kondashivaradhan@gmail.com")
const originalText = Decrypt(ciper,'kondashivaradhan@gmail.com')
      // let ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
      
      // let bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');

      // let originalText = bytes.toString(CryptoJS.enc.Utf8);
      
      console.log(originalText); // 'my message'
    };

    hashData();
  }, []);

  return (
    <View>
      <Text>Hashing Example</Text>
    </View>
  );
}
