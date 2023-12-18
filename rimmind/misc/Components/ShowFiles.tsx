import { Alert, Linking, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import WhiteText from './WhiteText'

import { Entypo } from '@expo/vector-icons';

interface FileProp {
    file: any[]
    edit: boolean
}
import { FontAwesome5 } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { extractDriveFileId, truncateText } from '../Constant';
import { GdriveAtom } from '../atoms';

const FilesBox: React.FC<FileProp> = ({ file, edit }) => {
    const [gdrive, setGDrive] = useAtom(GdriveAtom)


    
    const onDelete = (t: any) => {
        const fid = extractDriveFileId(t.url);

        Alert.alert('Careful Now', 'This File will be Deleted!', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'OK', onPress: async () => {
                    if (gdrive) {
                        const createF = async () => {
                            try {
                              if (fid) {
                                await gdrive.files.delete(fid);
                                console.log('File deleted successfully');
                                return true;
                              }
                            } catch (error) {
                              console.error('File Not Found');
                              return false;
                            }
                          };
               
                        createF().then(data => {
                            console.log(data);
                          });
                    }
                },
            }

        ]);

    }

    const parsedFiles = file.map((jsonString) => JSON.parse(jsonString));

    return (
        <View style={styles.container}>
            {parsedFiles.map((t, index) => (
                <View key={index} style={styles.tagBox}>
                    <TouchableOpacity key={index} style={{
                        flexDirection: 'row',
                        gap: 3,
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',

                        paddingHorizontal: 3,
                        borderRadius: 5,
                    }} onPress={() => Linking.openURL(t.url)}>
                        <FontAwesome5 name="google-drive" size={16} color="#6593cf" />
                        <WhiteText>
                            {truncateText(t.name, 10)}
                        </WhiteText>
                    </TouchableOpacity>
                    {edit &&
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 3,
                        }}
                            onPress={() => onDelete(t)}  >
                            <Entypo name="circle-with-cross" size={30} color="#ac3535" />
                        </TouchableOpacity>
                    }

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
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: 'white',
        paddingHorizontal: 3,
        borderRadius: 5,
    }
})