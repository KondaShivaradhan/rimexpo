import { Linking, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAtom } from 'jotai'
import { recordsAtom, userAtom } from '../../misc/atoms'
import { ScrollView } from 'react-native-gesture-handler'
import { UserRecord } from '../../misc/interfaces'
import { colortemp } from '../../misc/Constant'
import { Feather } from '@expo/vector-icons';
import FilesBox from '../../misc/Components/ShowFiles'
import Tags from '../../misc/Components/Tags'

import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router'


const Analytics: React.FC = () => {
    const [userRecords, setARecords] = useAtom(recordsAtom)
    const [tagCounts, setTagCounts] = useState<{ tag: string; count: number }[]>([]);
    const [ttag, settag] = useState<string>('')
    const { tg } = useLocalSearchParams()

    useEffect(() => {
        const calculateTagCounts = () => {
            const counts: { [tag: string]: number } = {};
            for (const record of userRecords) {
                for (const tag of record.tags) {
                    counts[tag] = (counts[tag] || 0) + 1;
                }
            }
            const tagCountArray = Object.entries(counts).map(([tag, count]) => ({ tag, count }));
            setTagCounts(tagCountArray);
        };
        calculateTagCounts();
        settag(tg as string);

    }, [tg]);
    const filterRecordsByTag = (records: UserRecord[], targetTag: string): UserRecord[] => {
        return records.filter(record => record.tags.includes(targetTag));
    };
    const filteredRecords = filterRecordsByTag(userRecords, ttag);
    const capitalizeFirstLetter = (text: string) => {

        return text.replace(/\b\w/g, (match) => match.toUpperCase());
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <ScrollView>
                <View style={styles.container}>
                    <Text style={{ color: 'white' }}>You have {userRecords.length} in Total along with {tagCounts.length} distict tags</Text>
                    <Text style={{ color: 'white' }}>These are the individual tags analytics</Text>
                    <View style={styles.TagsContainer}>
                        {tagCounts.map(({ tag, count }) => (
                            <TouchableOpacity onPress={() => settag(tag)} key={tag} style={{ flexDirection: 'row', backgroundColor: '#2e2e2e', padding: 5, borderRadius: 5 }}>
                                <Text style={{ color: '#ffffff', marginHorizontal: 3 }}>{`${tag}`}</Text>
                                <Text style={{ color: '#000000', paddingVertical: 2, paddingHorizontal: 5, marginHorizontal: 2, backgroundColor: '#a5cf58', borderRadius: 25 }}>{`${count}`}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>
                {
                    filteredRecords.map((item, index) => {
                        const urlRegex = /(https?:\/\/[^\s]+)/g;
                        const parts = item.description.split(urlRegex);

                        const extractDomain = (url: any) => {
                            return url.replace(/^https?:\/\//i, '').split('/')[0];

                        };
                        return (
                            <View key={index} style={{ padding: 10, margin: 10, backgroundColor: colortemp[1], borderRadius: 15, elevation: 2 }}>
                                {/* <WhiteText>ruid: {item.ruid}</WhiteText> */}

                                <Text style={{ color: 'white', fontFamily: 'Inter_900Black', }}>{capitalizeFirstLetter(item.title)}</Text>
                                {(item.description.length > 0) &&
                                    <View style={{ flexDirection: 'row', gap: 0, flexWrap: 'wrap' }} >
                                        {parts.map((part, index) => (
                                            index % 2 === 0 ? (

                                                <Text key={index} style={{ color: 'white', }} >{part}</Text>
                                            ) : (
                                                <Text key={index} style={{
                                                    color: '#ffffff',
                                                    backgroundColor: colortemp[2],
                                                    paddingHorizontal: 3,
                                                    borderRadius: 5,
                                                }} onPress={() => Linking.openURL(part)}>
                                                    <Feather name="external-link" size={16} color={colortemp[3]} />

                                                    {extractDomain(part)}
                                                </Text>


                                            )
                                        ))}
                                    </View>
                                }
                                {
                                    (item.media?.length > 0) && <FilesBox edit={false} file={item.media} />
                                }

                                {/* <Text style={{ color: 'white' }} >{item.description}</Text> */}
                                <Tags tags={item.tags}></Tags>
                                <View style={{ flexDirection: 'row', gap: 5, marginVertical: 10 }}>

                                    <TouchableOpacity onPress={() => {

                                        // router.push({ pathname: 'main/editrecord', params:item })
                                        router.push({ pathname: 'main/editrecord', params: { ruid: item.ruid } })

                                    }} style={{ backgroundColor: '#3498DB', padding: 5, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                        <Ionicons name="pencil" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }
                    )
                }

            </ScrollView>
        </SafeAreaView>
    )
}

export default Analytics


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        gap: 15,
        marginTop: 40,
    },
    TagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: 10,
        paddingHorizontal: 15,
    },



})