import { ActivityIndicator, Button, FlatList, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { classicDarkTheme, urls } from '../../misc/Constant';
import { useResetAtom } from "jotai/utils";
import { UserRecord } from '../../misc/interfaces';
import { useAtom } from 'jotai';
import { statusAtom, tagsAtom, userAtom } from '../../misc/atoms';
import AddBtn from '../../misc/Components/AddBtn';
import WhiteText from '../../misc/Components/WhiteText';
import Tags from '../../misc/Components/Tags';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Status from '../../misc/Components/Status';
import { router, useFocusEffect } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();
const Dashboard: React.FC = () => {
  const [tagA, setTagAtom] = useAtom(tagsAtom)
  const [loading, setLoading] = useState(true);
  const [tags, settags] = useState([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ua, setua] = useAtom(userAtom);

  const resetUserAtom = useResetAtom(userAtom)
  if (ua.email == "") {
    router.back()
  }
  useEffect(() => {
    fetchData();
  }, [ua]);
  const [sa, setsa] = useAtom(statusAtom)
  const [records, setRecords] = useState<UserRecord[]>([]);
  const [filteredData, setFilteredData] = useState<UserRecord[]>(records);
  const fetchData = async () => {
    console.log(`best thig ${JSON.stringify(ua)}`);

    if (ua.email == "") {
      router.replace('login')
    }
    setLoading(true);
    try {
      const emailObject = { email: ua.email };
      const config = { headers: { 'Content-Type': 'application/json' } };
      const response = await axios.post(`${urls.devNode}/rim`, emailObject, config);
      console.log(response.data);
      if (response.data == "exists") {

        const recordsResponse = await axios.get(`${urls.fetchRecords}?email=${ua.email}`);
        var allTags = [...new Set(recordsResponse.data.flatMap((t: any) => t.tags))]
        console.log(allTags);
        console.log(allTags);
        setTagAtom(allTags as string[])
        setRecords(recordsResponse.data);
        setFilteredData(recordsResponse.data);
      }
      else {
        setRecords([]);
        setFilteredData([]);
      }

    } catch (error) {
      console.error('Error while fetching user records:', error);
      setsa({ status: 'error in fetchData from dashboardscreen' })
    }
    finally {
      setLoading(false); // Set loading to false when the fetch is complete, whether it was successful or not
    }
  };
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      router.replace('login')
    } catch (error) {
      console.error(error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchData()
    }, [])
  )
  const deleteThis = async (id: number) => {
    console.log('trying to delete this with id ' + id);
    try {
      const response = await axios.delete(`${urls.delRecord}/?id=${id as number}`)
      console.log(response.data);
      fetchData()

    } catch (error) {
      setsa({ status: 'error in deleteThis from dashboardscreen' })
    }

  }

  const debouncedSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = records.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  const handleSearch = debounce(debouncedSearch, 300);

  const renderItem = ({ item }: { item: UserRecord }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
      {/* <WhiteText>id: {item.id}</WhiteText> */}
      <Text style={{ color: 'white',fontFamily: 'Inter_900Black',  }}>{item.title}</Text>
      <Text style={{ color: 'white' }} >{item.description}</Text>
      <Tags tags={item.tags}></Tags>
      <View style={{ flexDirection: 'row', gap: 5, marginVertical: 10 }}>
        <TouchableOpacity onPress={() => { deleteThis(item.id) }} style={{ backgroundColor: '#3498DB', padding: 5, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="trash" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { router.push({ pathname: 'main/editrecord', params: item as UserRecord }) }} style={{ backgroundColor: '#3498DB', padding: 5, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.container}>
        <WhiteText>Explore your Records</WhiteText>
        <TextInput
          style={{ height: 40, color: 'white', borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
          placeholder="Search..."
          placeholderTextColor="white"
          onChangeText={handleSearch}
        />
        {(loading) ? <ActivityIndicator size="large" color="white" /> : (filteredData.length <= 0) ?
          <WhiteText>Looks like you dont have any records </WhiteText> :
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()} // Assuming there's an 'id' property in UserRecord
            renderItem={renderItem}
          />
        }

      </View>
      <AddBtn />
      <Status></Status>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: classicDarkTheme.background,
  },
});

function debounce(func: Function, wait: number) {
  let timeout: any;
  return function (this: any, ...args: any[]) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}
