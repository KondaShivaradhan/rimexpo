import { Linking, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import WhiteText from './WhiteText'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { colortemp } from '../Constant'
import { media } from '../interfaces'
interface FileProp {
    file: any[]
    edit:boolean
}
import { FontAwesome5 } from '@expo/vector-icons';


const extractDomain = (url: any) => {
    return url.replace(/^https?:\/\//i, '').split('/')[0];

};
const FilesBox: React.FC<FileProp> = ({ file }) => {
    interface YourComponentProps {
        longText: string;
      }
      
      const truncateText = (text: string, maxLength: number): string => {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
      };
      
    console.log(file);

    const parsedFiles = file.map((jsonString) => JSON.parse(jsonString));

    return (
        <View style={styles.container}>
            {parsedFiles.map((t, index) => (
                <View key={index} style={styles.tagBox}>
                    <TouchableOpacity key={index} style={{
                        flexDirection:'row',
                        gap:3,
                        alignContent:'center',
                        justifyContent: 'center',
                        paddingHorizontal: 3,
                        borderRadius: 5,
                    }} onPress={() => Linking.openURL(t.url)}>
                        <FontAwesome5 name="google-drive" size={16} color="#6593cf" />
                        <WhiteText>
                            {truncateText(t.name,10)}
                        </WhiteText>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    )
}


export default FilesBox

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
        marginVertical: 4
    },
    tagBox: {
        paddingVertical: 5,
        borderWidth:1,
        borderColor:'white',
        paddingHorizontal: 3,
        borderRadius: 5,
    }
})