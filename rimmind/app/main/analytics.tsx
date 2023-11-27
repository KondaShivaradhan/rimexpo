import {  StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAtom } from 'jotai'
import { recordsAtom, userAtom } from '../../misc/atoms'
interface UserRecord {
    id: number;
    user_email_id: number;
    title: string;
    description: string;
    tags: string[];
    media: string[] | null;
  }

const Analytics:React.FC = () => {
    const [userRecords, setARecords] = useAtom(recordsAtom)
    const [ua, setua] = useAtom(userAtom);

    const [tagCounts, setTagCounts] = useState<{ tag: string; count: number }[]>([]);
   

    useEffect(() => {
        // Function to calculate tag counts
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

        // Calculate tag counts on mount
        calculateTagCounts();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            <View style={styles.container}>
                <Text style={{color:'white'}}>You have {userRecords.length} in Total along with {tagCounts.length} distict tags</Text>
                <Text style={{color:'white'}}>These are the individual tags analytics</Text>
                <View style={styles.TagsContainer}>
                    {tagCounts.map(({ tag, count }) => (
                        <View key={tag} style={{ flexDirection: 'row', backgroundColor: '#2e2e2e', padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: '#ffffff', marginHorizontal: 3 }}>{`${tag}`}</Text>
                            <Text style={{ color: '#000000', paddingVertical: 2, paddingHorizontal: 5, marginHorizontal: 2, backgroundColor: '#a5cf58', borderRadius: 25 }}>{`${count}`}</Text>
                        </View>
                    ))}
                </View>

            </View>
        </SafeAreaView>
    )
}

export default Analytics


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems:'center',
        gap:15,
        marginTop:40,
    },
    TagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        gap: 10,
        paddingHorizontal:15,
    },
 
  
  
})