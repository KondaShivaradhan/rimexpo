import { ActivityIndicator, Alert, BackHandler, Button, Dimensions, FlatList, Linking, RefreshControl, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Decrypt, classicDarkTheme, colortemp, delRecord, extractDriveFileId, urls } from '../../misc/Constant';
import { useResetAtom } from "jotai/utils";
import { UserRecord, media } from '../../misc/interfaces';
import { useAtom } from 'jotai';
import { recordsAtom, statusAtom, tagsAtom, userAtom } from '../../misc/atoms';
import AddBtn from '../../misc/Components/AddBtn';
import WhiteText from '../../misc/Components/WhiteText';
import Tags from '../../misc/Components/Tags';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Status from '../../misc/Components/Status';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Feather } from '@expo/vector-icons';
import FilesBox from '../../misc/Components/ShowFiles';
import { GDrive } from '@robinbobin/react-native-google-drive-api-wrapper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

SplashScreen.preventAutoHideAsync();
const { width } = Dimensions.get('window');
const itemWidth = (width - 20) / 2 - 10;
const Dashboard: React.FC = (navigation: any) => {
  const [tagA, setTagAtom] = useAtom(tagsAtom)
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ua, setua] = useAtom(userAtom);
  const [gdrive, setGDrive] = useState<GDrive>()

  const resetUserAtom = useResetAtom(userAtom)
  if (ua.email == "") {
    router.back()
  }


  useEffect(() => {

    const init = async () => {
      if (gdrive === null)
        try {

          const gdrv = new GDrive()

          gdrv.accessToken = (await GoogleSignin.getTokens()).accessToken

          gdrv.fetchCoercesTypes = true
          gdrv.fetchRejectsOnHttpErrors = true
          gdrv.fetchTimeout = 500000

          setGDrive(gdrv)

        } catch (error) {
          console.log(error)
        }
    }
    init()
    fetchData();
  }, []);
  const [sa, setsa] = useAtom(statusAtom)
  const [records, setRecords] = useState<UserRecord[]>([]);
  const [recordsA, setARecords] = useAtom(recordsAtom)
  const [filteredData, setFilteredData] = useState<UserRecord[]>(records);
  const fetchData = async () => {
    console.log(`$$$$$$$$$$$$$$$$$$$$$$$$$`);

    if (ua.email == "") {
      router.replace('login')
    }
    setLoading(true);
    setSearchQuery('')
    try {
      const emailObject = { email: ua.email };
      const config = { headers: { 'Content-Type': 'application/json' } };
      const response = await axios.post(`${urls.devNode}/rim`, emailObject, config);
      if (response.data == "exists") {
        var temp: UserRecord[] = []

        const recordsResponse = await axios.get(`${urls.fetchRecords}?email=${ua.email}`);
        for (const key in recordsResponse.data) {
          if (recordsResponse.data.hasOwnProperty(key)) {
            const z = recordsResponse.data[key];
            const newArray = z.tags.map((x: any) => { return Decrypt(x, ua.email) })
            try {
              const updated = {
                title: Decrypt(z.title, ua.email),
                description: Decrypt(z.description, ua.email),
                tags: newArray,
                media: z.media,
                ruid: z.ruid,
                userid: z.userid
              }
              temp.push(updated)

            } catch (error) {
              console.log(error);

            }

          }
        }

        var allTags = [...new Set(temp.flatMap((t: any) => t.tags))]

        setTagAtom(allTags as string[])
        setRecords(temp);
        setARecords(temp)
        setFilteredData(temp);
      }
      else {
        setRecords([]);
        setFilteredData([]);
      }

    } catch (error) {
      console.error('Server is Currently Down Contact Developer');
      setsa({ status: 'error in fetchData from dashboardscreen' })
    }
    finally {
      setLoading(false); // Set loading to false when the fetch is complete, whether it was successful or not
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchData()
  //   }, [])
  // )

  const deleteThis = async (ruid: string) => {
    setLoading(true)
    console.log('trying to delete this with ruid ' + ruid);
    Alert.alert('Careful Now', 'This record will be Deleted!', [
      {
        text: 'Cancel',
        onPress: () => setLoading(false)
        ,
        style: 'cancel',
      },
      {
        text: 'OK', onPress: async () => {
          try {
            const gdrv = new GDrive()
            gdrv.accessToken = (await GoogleSignin.getTokens()).accessToken

            gdrv.fetchCoercesTypes = true
            gdrv.fetchRejectsOnHttpErrors = true
            gdrv.fetchTimeout = 500000

            const filteredRecords = recordsA.filter(record => record.ruid === ruid);
            const thisRecord = filteredRecords[0];
            console.log(thisRecord.media);

            if (thisRecord.media !== null && thisRecord.media.length > 0) {
              const allURLs = thisRecord.media.map((x) => {
                //@ts-ignores

                return extractDriveFileId(JSON.parse(x).url)
              })
              const deletePromises = allURLs.map(async (fileId) => {
                try {
                  if (fileId) {
                    if (gdrv) {
                      try {
                      await gdrv.files.delete(fileId);
                      console.log(`File ${fileId} deleted successfully`);

                      return true;
                        
                      } catch (error) {
                      return true;
                        
                      }

                    }
                    else {
                      console.log(`No gdrive`);
                    }
                    return false
                  }
                  return false;
                } catch (error) {
                  console.error(`Error deleting file ${fileId}:`, error);
                }
              });

              Promise.all(deletePromises).then(async (results) => {
                // Check if all deletions were successful
                const allDeleted = results.every(result => result);

                if (allDeleted) {
                  try {
                    const response = await axios.delete(delRecord(ruid));
                    console.log(response.data);
                    fetchData()

                  } catch (error) {
                    console.error('Error deleting record:', error);
                  }
                }
                else {
                  console.log('something wrong');
                  setLoading(false)

                }
              });
             
            }
            else {
              console.log('media is null');

              const response = await axios.delete(delRecord(ruid))
              // const response = await axios.delete(`${urls.delRecord}/?ruid=${ruid}`)
              console.log(response.data);
              fetchData()

            }




          } catch (error) {
            setsa({ status: 'error in deleteThis from dashboardscreen' })
            console.log(error)
          }
        }
      },

    ]);


  }

  const debouncedSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = records.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        // item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredData(filtered);
  };

  const handleSearch = debounce(debouncedSearch, 300);
  const capitalizeFirstLetter = (text: string) => {

    return text.replace(/\b\w/g, (match) => match.toUpperCase());
  };
  const renderItem = ({ item }: { item: UserRecord }) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = item.description.split(urlRegex);

    const extractDomain = (url: any) => {
      return url.replace(/^https?:\/\//i, '').split('/')[0];

    };
    return (
      <View style={{ padding: 10, margin: 10, backgroundColor: colortemp[1], borderRadius: 15, elevation: 2 }}>
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
          <TouchableOpacity onPress={() => { deleteThis(item.ruid) }} style={{ backgroundColor: '#3498DB', padding: 5, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="trash" size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {

            // router.push({ pathname: 'main/editrecord', params:item })
            router.push({ pathname: 'main/editrecord', params: { ruid: item.ruid } })

          }} style={{ backgroundColor: '#3498DB', padding: 5, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    )
  };

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
    <>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.container}>
        <TextInput
          style={{ height: 40, color: 'white', borderColor: 'gray', borderWidth: 1, margin: 10, padding: 5 }}
          placeholder="Search..."
          placeholderTextColor="white"
          onChangeText={handleSearch}
        />
        {(loading) ?
        <View style={{flex:1,flexGrow:1,flexDirection:'column',justifyContent: 'center',alignContent:'center',alignItems:'center'}}>
          <WhiteText>
            Fetching Changes.., Hold on!
</WhiteText>
<Text>
<ActivityIndicator size="large" color="white" /> 
</Text>
          </View>
      : (filteredData.length <= 0) ?
          <View style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', gap: 10, }}>
            <WhiteText style={{ textAlign: 'center' }}>Looks like you dont have any records </WhiteText>
            <View style={{}}>
              <TouchableOpacity onPress={fetchData} style={{ backgroundColor: colortemp[2], paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, overflow: 'hidden' }} >
                <WhiteText>Check again</WhiteText>
              </TouchableOpacity>
            </View>
          </View>
          :
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={fetchData}
                tintColor="#4285f4" // Color of the refresh indicator
              />
            }
            data={filteredData}
            keyExtractor={(item) => item.ruid.toString()} // Assuming there's an 'ruid' property in UserRecord
            renderItem={renderItem}
          />
        }

      </View>
      <AddBtn />
      <Status></Status>
    </>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
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
