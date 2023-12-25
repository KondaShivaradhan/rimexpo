import { ActivityIndicator, Alert, Button, FlatList, Image, Linking, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link, router, useLocalSearchParams, useNavigation } from 'expo-router';
import WhiteText from '../../misc/Components/WhiteText';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { FormValues, UserRecord, UserRecord2, media } from '../../misc/interfaces';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { DeleleFiles, Encrypt, UploadNewMedia, colortemp, extractDriveFileId, findNonSimilarElements, truncateText, urls } from '../../misc/Constant';
import { useAtom } from 'jotai';
import { GdriveAtom, recordsAtom, statusAtom, tagsAtom, userAtom } from '../../misc/atoms';
import Status from '../../misc/Components/Status';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as DocumentPicker from 'expo-document-picker';
import File from '../../misc/Components/File';
import { Entypo } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system'

import {
  GDrive,
} from "@robinbobin/react-native-google-drive-api-wrapper";
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router/src/useFocusEffect';
interface tempProp {
  ruid?: string
}
const EditRecord: React.FC = () => {

  const [gdrive, setGDrive] = useState<GDrive>()
  const [gadrive, setAGDrive] = useAtom(GdriveAtom)
  console.log("$%#$%#$%#$%#$%#$%#$");
  const [Allrecords] = useAtom(recordsAtom)
  let param: tempProp = useLocalSearchParams()
  console.log(param);
  let ruid = param.ruid;
  var item: UserRecord | undefined = Allrecords.find(e => e.ruid === ruid);
  const [tagsA, setsseta] = useAtom(tagsAtom)
  const [pickedDocuments, setPickedDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [oldFiles, setOF] = useState<media[]>([])
  const [toDel, setTodel] = useState<media[]>([])
  const [ua, setua] = useAtom(userAtom)
  const [sa, setsa] = useAtom(statusAtom)
  DropDownPicker.setTheme("DARK");
  DropDownPicker.setMode("BADGE");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  const [uploadP, setUprogress] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const itemsy = tagsA.map((item, index) => ({
    label: item,
    value: item,
    id: index.toString(),

  }));
  const [items, setItems] = useState(itemsy);


  const [formValues, setFormValues] = useState<FormValues>({
    user: ua.email,
    title: 'temp.title',
    desp: ' temp.description',
    TagArray: [],
    media: []
  });
  const [value, setValue] = useState(formValues.TagArray);

  const isFormValid = (formValues: FormValues): boolean => {
    if (!formValues.title || formValues.TagArray.length === 0) {
      return false;
    }
    return true;
  };
  const handleInputChange = (fieldName: keyof FormValues, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };
  const readFileAsBase64 = async (fileUri: string) => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });


      return fileContent;
    } catch (error) {
      console.error('Error converting file to Base64:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    console.log('submitting data');
    
    setIsSubmitting(true)
    var UploadedFilesURLs: media[] = []
    var converted_tags = value.map((item: string) => item.replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
    converted_tags = Array.from(new Set(converted_tags))
    const newArray: string[] =
      converted_tags.map((item: string) =>
        Encrypt(item.replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase(), ua.email)
      );
    
    var FinalVales: FormValues = {
      user: '',
      title: '',
      desp: '',
      TagArray: [],
      media: []
    }
    formValues.user = ua.email
    formValues.TagArray = newArray
    FinalVales.user = ua.email
    FinalVales.TagArray = newArray
    FinalVales.title = Encrypt(formValues.title, ua.email)
    FinalVales.desp = Encrypt(formValues.desp, ua.email)
    console.log(toDel)


    if (isFormValid(FinalVales) && gdrive) {
      try {
        console.log("sending stuff to Database");

        const [uploadedFiles, deleteResult] = await Promise.all([
          UploadNewMedia(gdrive, pickedDocuments),
          DeleleFiles(gdrive, toDel),
        ]);

        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        FinalVales.media = [...uploadedFiles, ...oldFiles];

        const response = await axios.put(`${urls.edit}?ruid=${item?.ruid}`, FinalVales, config);

        console.log("updated response - " + response.data);
        console.log("updated response status - " + response.status);

        if (response.status === 200) {
          console.log("Not same");
          setsa({ status: response.data.message });
          setIsSubmitting(false)

          router.push('main/dashbord');
        } else {
          setsa({ status: response.data.message });
        }
      } catch (error) {
        console.log(`error sending data ${error}`);
        setIsSubmitting(false)

      }
    }
  };

  useEffect(() => {
    const init = async () => {
      try {

        const gdrv = new GDrive()

        gdrv.accessToken = (await GoogleSignin.getTokens()).accessToken

        gdrv.fetchCoercesTypes = true
        gdrv.fetchRejectsOnHttpErrors = true
        gdrv.fetchTimeout = 500000
        setAGDrive(gdrv)
        setGDrive(gdrv)
        console.log(gdrv);

      } catch (error) {
        console.log(error)
      }
    }
    init()
  }, [])
  const renderItem = ({ item }: { item: DocumentPicker.DocumentPickerAsset }) => (
    <TouchableOpacity disabled={isSubmitting} style={styles.box} onPress={() => {
      const updatedData = pickedDocuments.filter(x => x.uri != item.uri);
      console.log(updatedData);

      setPickedDocuments(updatedData);
    }}>
      {(item.mimeType?.includes("application")) &&
        <File />
      }
      {(!item.mimeType?.includes("image")) &&
        <Text style={{ color: 'white', fontSize: 12, }}>{item.name}</Text>
      }

      {/* <WhiteText>Document type: {item.mimeType}</WhiteText> */}
      {(item.mimeType?.includes("image")) &&
        <Image source={{ uri: item.uri }} height={50} width={50}></Image>
      }

    </TouchableOpacity>
  );
  const onDelete = (t: any) => {
    t = JSON.parse(t)
    var temp = toDel
    temp.push(t)
    setTodel(temp)
    var asdf = oldFiles.filter(x => {
      // @ts-ignore
      x = JSON.parse(x)
      if (t.url == x.url) {
      }
      else {
        return x
      }
    })
    console.log(asdf);
    setOF(asdf)
  }
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      try {
        item = Allrecords.find(e => e.ruid === ruid);
        console.log('came fo Focus');
        
        if (item) {
          console.log(item);

          const newArray = item.tags.map((tag) => tag.toLowerCase());
          console.log(newArray);
          
          setFormValues({
            user: ua.email,
            title: item.title ?? '',
            desp: item.description ?? '',
            TagArray: newArray,
            media: item.media,
          });
          setOF(item.media);
          setValue(newArray);
          setTodel([]);
          setPickedDocuments([])
          setForceRender((prevState) => !prevState);
        } else {
          // Handle the case where item is falsy (optional)
        }
      } catch (error) {
        // Handle any errors that might occur during the execution
      }
      setLoading(false);
      setUprogress(0)
      // setPickedDocuments([])
      setIsSubmitting(false)
    }, [item])
  );
  // useEffect(() => {
  //   // Check if the item is a UserRecord
  //   try {
  //     if (item) {
  //       const newArray: string[] = item.tags.map((tag: string) => tag.toLowerCase());
  //       setFormValues({
  //         user: ua.email,
  //         title: item.title ?? '',
  //         desp: item.description ?? '',
  //         TagArray: newArray,
  //         media: item.media
  //       });
  //       setOF(item.media)
  //       setValue(newArray)
  //       setForceRender(prevState => !prevState);
  //     } else {
  //     }
  //   } catch (error) {
  //   }

  // }, [item]);
  //   useEffect(() => {
  //       // This code will run every time the screen comes into focus

  //       try {
  //         item = Allrecords.find(e => e.ruid === ruid);
  // console.log('came fo Effect');

  //         if (item) {

  //           const newArray = item.tags.map((tag) => tag.toLowerCase());
  //           setFormValues({
  //             user: ua.email,
  //             title: item.title ?? '',
  //             desp: item.description ?? '',
  //             TagArray: newArray,
  //             media: item.media,
  //           });
  //           setOF(item.media);
  //           setValue(newArray);
  //           setForceRender((prevState) => !prevState);
  //         } else {
  //           // Handle the case where item is falsy (optional)
  //         }
  //       } catch (error) {
  //         // Handle any errors that might occur during the execution
  //       }

  //     // The cleanup function (optional)
  //     return () => {
  //       // Perform any cleanup or unsubscribe from events if needed
  //     };
  //   }, [item]); 
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        // type: '*/*', // Allow any type of file
        type: [
          'audio/*',
          'image/*',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/zip',
        ],
        copyToCacheDirectory: true,
      });
      console.log(result);

      if (result.assets) {
        console.log(result.assets);
        setPickedDocuments(result.assets)
      }
      else {
        setPickedDocuments([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      {loading ? <>
        <ActivityIndicator /></> :
        <ScrollView keyboardShouldPersistTaps={'always'}>
          {/* <View style={{  alignItems: 'center', justifyContent: 'center' }}> */}
          <View style={{}}>
            <View style={{ flexDirection: 'column', margin: 10, gap: 5, }}>

              <Text style={styles.label}>Title:</Text>
              <TextInput

                style={styles.TextF}
                value={formValues.title}
                onChangeText={(text) => handleInputChange('title', text)}
                placeholder="Enter title"

              />


              <Text style={styles.label}>Description:</Text>
              <TextInput
                style={styles.TextF}

                value={formValues.desp}
                onChangeText={(text) => handleInputChange('desp', text)}
                placeholder="Enter description"
                multiline
              />
              {/* Files before deletion */}

              <View style={{ margin: 10 }}>
                {
                  (oldFiles !== null && oldFiles.length > 0) && (
                    <>
                      <Text style={styles.label}>Files:</Text>

                      <View style={styles.container}>

                        {oldFiles.map((x, index) => {
                          // @ts-ignore
                          const t = JSON.parse(x)
                          return (
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
                              <TouchableOpacity style={{
                                flexDirection: 'row',
                                alignContent: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 3,
                              }}
                                onPress={() => onDelete(JSON.stringify(t))}  >
                                <Entypo name="circle-with-cross" size={30} color="#ac3535" />
                              </TouchableOpacity>

                            </View>
                          )
                        }
                        )
                        }

                      </View>
                    </>
                  )}

              </View>
              {/* Files after deletion */}
              {/* new Files */}
              <Text style={styles.label}>New Files:</Text>
              <Button title='Media Pick' disabled={isSubmitting} onPress={() => { pickDocument() }} />
              {pickedDocuments.length > 0 && (
                <>
                  <Text style={{ fontSize: 9, color: 'white', textAlign: 'center' }}>Selected Files {pickedDocuments.length}</Text>

                  <FlatList
                    style={{ backgroundColor: '#4c4c6678' }}
                    contentContainerStyle={{ justifyContent: 'center' }}
                    data={pickedDocuments}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.uri}
                    horizontal={true} // Set to true for a horizontal FlatList
                  />
                  <Text style={{ fontSize: 9, color: 'white', textAlign: 'center' }}>* Click to deselect</Text>

                  {(uploadP >= 0 && isSubmitting) && <View>
                    <WhiteText>
                      Files being uploaded = {uploadP}/{pickedDocuments.length}

                    </WhiteText>
                    {uploadP != pickedDocuments.length && <ActivityIndicator />}

                  </View>}
                </>
              )}
              <WhiteText>Tags </WhiteText>
              <DropDownPicker
                open={open}
                multiple={true}
                min={1}
                value={value}
                items={items}

                schema={{
                  label: 'label',
                  value: 'value',
                }}
                searchable={true}
                closeOnBackPressed={true}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                mode="BADGE"
                badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a", "#e76f51", "#8ac926", "#00b4d8", "#e9c46a"]}
                addCustomItem={true}
                listMode='MODAL'
                modalAnimationType='slide'
              />
              <Button title="Submit" disabled={isSubmitting} onPress={handleSubmit} />
            </View>
            <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center', margin: 5, backgroundColor: '#1f3235' }}>

              {(isSubmitting) ?
                <ActivityIndicator /> :
                <Link href="../" asChild><Button color={'#86382e960'} title='Cancel'></Button></Link>

              }
            </View>
          </View>

        </ScrollView>
      }

      <Status />
    </SafeAreaView>

  );
}
export default EditRecord
const styles = StyleSheet.create({
  TextF: {
    borderColor: 'white',
    color: 'white',
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  label: {
    marginTop: 0,
    color: '#e9e9e9',
    marginLeft: 5,
    fontWeight: 'bold'
  },
  iconStyle: {
    height: 10,
    width: 10,
  },
  box: {
    padding: 5,
    borderRadius: 10,
    margin: 10,
    backgroundColor: colortemp[2],
    alignContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'space-evenly'
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginVertical: 4
  },
  tagBox: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 3,
    borderRadius: 5,
  }
})