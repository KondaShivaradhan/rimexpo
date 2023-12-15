import { ActivityIndicator, Button, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link, router } from 'expo-router';
import WhiteText from '../../misc/Components/WhiteText';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { FormValues, media } from '../../misc/interfaces';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { Encrypt, colortemp, urls } from '../../misc/Constant';
import { useAtom } from 'jotai';
import { statusAtom, tagsAtom, userAtom } from '../../misc/atoms';
import Status from '../../misc/Components/Status';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router/src/useFocusEffect';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GDrive,
  ListQueryBuilder,
  MimeTypes
} from "@robinbobin/react-native-google-drive-api-wrapper";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system'
import Toast from 'react-native-root-toast';
import File from '../../misc/Components/File';
const Modal: React.FC<DrawerHeaderProps> = ({ navigation }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  var UploadedFilesURLs: media[] = []
  const [ua, setua] = useAtom(userAtom)
  const [sa, setsa] = useAtom(statusAtom)
  const [tagsA, setsseta] = useAtom(tagsAtom)
  DropDownPicker.setTheme("DARK");
  DropDownPicker.setMode("BADGE");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [uploadP, setUprogress] = useState<number>(0);
  const [gdrive, setGDrive] = useState<GDrive>()


  const [pickedDocuments, setPickedDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
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
  const itemsy = tagsA.map((item, index) => ({
    label: item,
    value: item,
    id: index.toString(),

  }));
  const [items, setItems] = useState(itemsy);
  const [formValues, setFormValues] = useState<FormValues>({
    user: '',
    title: '',
    desp: '',
    TagArray: [],
    media: []
  });
  const isFormValid = (formValues: FormValues): boolean => {
    if (!formValues.title || !formValues.desp || formValues.TagArray.length === 0) {
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
  const handleSubmit = async () => {
    Toast.show('Fetching....', {
      duration:3000,
      position: Toast.positions.BOTTOM - 80,
      animation: true,
      hideOnPress: true,
      backgroundColor: '#313e61',
      opacity: 1
    });
    setIsSubmitting(true);
    const newArray: string[] = value.map((item: string) => {
      return Encrypt(item.replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase(), ua.email);
    });
    var FinalVales: FormValues = {
      user: '',
      title: '',
      desp: '',
      TagArray: [],
      media: []
    }
    // formValues.user = ua.email
    FinalVales.user = ua.email
    // formValues.TagArray = newArray
    FinalVales.TagArray = newArray
    // formValues.title = Encrypt(formValues.title, ua.email)
    FinalVales.title = Encrypt(formValues.title, ua.email)
    // formValues.desp = Encrypt(formValues.desp, ua.email)
    FinalVales.desp = Encrypt(formValues.desp, ua.email)
    console.log('Form values submitted:', FinalVales);

    if (isFormValid(FinalVales)) {
      console.log("sending stuff to Database");
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        if (pickedDocuments.length > 0) {
          console.log('uploading files');

          if (gdrive) {
            try {
              var Fid: string = ""
              const createF = async () =>
                await gdrive.files.createIfNotExists(
                  {
                    q: new ListQueryBuilder()
                      .e('name', 'RimData')
                      .and()
                      .e('mimeType', MimeTypes.FOLDER)
                      .and()
                      .in('root', 'parents'),
                  },
                  gdrive.files.newMetadataOnlyUploader().setRequestBody({
                    name: 'RimData',
                    mimeType: MimeTypes.FOLDER,
                    parents: ['root'],
                  }),
                )

              createF().then(
                async (data) => {
                  console.log(data);
                  for (const pickedDocument of pickedDocuments) {
                    try {
                      const base64Data = await readFileAsBase64(pickedDocument.uri);
                      const result = await gdrive.files
                        .newMultipartUploader()
                        .setData(base64Data, MimeTypes.BINARY)
                        .setIsBase64(true)
                        .setRequestBody({
                          name: pickedDocument.name,
                          // @ts-ignore
                          parents: [data.result.id],
                        })
                        .execute();

                      console.log('Upload result:', result);
                      const metadataResult = await gdrive.files.getMetadata(result.id, {
                        fields: 'webViewLink',
                      });

                      console.log('Metadata result:', metadataResult.webViewLink);
                      UploadedFilesURLs.push({ name: pickedDocument.name, url: metadataResult.webViewLink })
                      console.log(`File '${pickedDocument.name}' upload completed`);
                      setUprogress((uploadP) => uploadP + 1);
                      console.log(`the test value is ${UploadedFilesURLs}`);

                      // Now, you can access UploadedFilesURLs after handleFiles has completed

                    } catch (uploadError) {
                      console.error(`Error uploading file '${pickedDocument.name}':`, uploadError);
                    }
                  }
                  FinalVales.media = UploadedFilesURLs;
                  console.log("URLs of the files");
                  console.log(UploadedFilesURLs);
                  console.log("Updated Form data");
                  console.log(FinalVales);

                  const response = await axios.post(`${urls.add}`, FinalVales, config);
                  console.log(response.data);

                  if (response.status === 200) {
                    setsa({ status: response.data.message });
                    router.push('main/dashbord');
                  } else {
                    setsa({ status: response.data.message });
                  }
                }
              ).finally(async () => {
                try {
                  const url = "file:///data/user/0/com.android.rimmind/cache/DocumentPicker/"
                  await FileSystem.deleteAsync(url, {})
                  // 1ocnUewlRlSE-aCjqChcF7rSW-OIMaMuX
                  console.log(UploadedFilesURLs);
                  setIsSubmitting(false);
                  return UploadedFilesURLs
                } catch (error) {
                  setIsSubmitting(false);
                }
              })
            } catch (error) {
              console.error('Error uploading files:', error);
            }
          }

        }
        else {
          console.log('No files to upload');
          FinalVales.media = []
          const response = await axios.post(`${urls.add}`, FinalVales, config);
          console.log(response.data);
          if (response.status == 200) {
            setsa({ status: response.data.message })
            router.push('main/dashbord')
          }
          else {
            setsa({ status: response.data.message })

          }
        }


      } catch (error) {
        console.log(`error sending data ${error}`);

      }

    }
    else {
      console.log("Invalid details")
      setIsSubmitting(false);
    }
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
  const handleFiles = async () => {

    if (gdrive) {
      try {
        var Fid: string = ""
        const createF = async () =>
          await gdrive.files.createIfNotExists(
            {
              q: new ListQueryBuilder()
                .e('name', 'RimData')
                .and()
                .e('mimeType', MimeTypes.FOLDER)
                .and()
                .in('root', 'parents'),
            },
            gdrive.files.newMetadataOnlyUploader().setRequestBody({
              name: 'RimData',
              mimeType: MimeTypes.FOLDER,
              parents: ['root'],
            }),
          )
        // ;(await createF()).result
        // Fid = (await createF()).result.id;

        createF().then(
          async (data) => {
            console.log(data);
            for (const pickedDocument of pickedDocuments) {
              try {
                const base64Data = await readFileAsBase64(pickedDocument.uri);

                // await gdrive.files
                //   .newMultipartUploader()
                //   .setData(base64Data, MimeTypes.BINARY)
                //   .setIsBase64(true)
                //   .setRequestBody({
                //     name: pickedDocument.name,
                //     // @ts-ignore
                //     parents: [data.result.id]
                //   })
                //   .execute();
                const result = await gdrive.files
                  .newMultipartUploader()
                  .setData(base64Data, MimeTypes.BINARY)
                  .setIsBase64(true)
                  .setRequestBody({
                    name: pickedDocument.name,
                    // @ts-ignore
                    parents: [data.result.id],
                  })
                  .execute();

                console.log('Upload result:', result);
                const metadataResult = await gdrive.files.getMetadata(result.id, {
                  fields: 'webViewLink',
                });

                console.log('Metadata result:', metadataResult.webViewLink);
                UploadedFilesURLs.push(metadataResult.webViewLink)
                console.log(`File '${pickedDocument.name}' upload completed`);
                setUprogress((uploadP) => uploadP + 1);

              } catch (uploadError) {
                console.error(`Error uploading file '${pickedDocument.name}':`, uploadError);
                // Handle upload error as needed
              }
            }

          }
        ).finally(async () => {
          try {
            const url = "file:///data/user/0/com.android.rimmind/cache/DocumentPicker/"
            await FileSystem.deleteAsync(url, {})
            // 1ocnUewlRlSE-aCjqChcF7rSW-OIMaMuX
            console.log(UploadedFilesURLs);
            setIsSubmitting(false);
            return UploadedFilesURLs
          } catch (error) {
            setIsSubmitting(false);
          }
        })
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      setFormValues({
        user: '',
        title: '',
        desp: '',
        TagArray: [],
        media: []
      });
      setValue([])
      setUprogress(0)
      setPickedDocuments([])
      setIsSubmitting(false)
    }, [navigation])
  );
  useEffect(() => {

    const init = async () => {
      try {

        const gdrv = new GDrive()

        gdrv.accessToken = (await GoogleSignin.getTokens()).accessToken

        gdrv.fetchCoercesTypes = true
        gdrv.fetchRejectsOnHttpErrors = true
        gdrv.fetchTimeout = 500000

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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={{ flex: 1 }}>
        {/* <View style={{  alignItems: 'center', justifyContent: 'center' }}> */}
        <View style={{}}>
          <View style={{ flexDirection: 'column', margin: 10, gap: 10, }}>

            <WhiteText>Title:</WhiteText>
            <TextInput

              style={styles.TextF}
              value={formValues.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholder="Enter title"

            />

            <WhiteText>Description:</WhiteText>
            <TextInput
              style={styles.TextF}

              value={formValues.desp}
              onChangeText={(text) => handleInputChange('desp', text)}
              placeholder="Enter description"
              multiline
            />
            <WhiteText>Media:</WhiteText>
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

                {uploadP > 0 && <View>
                  <WhiteText>
                    Files being uploaded = {uploadP}/{pickedDocuments.length}

                  </WhiteText>
                  {uploadP != pickedDocuments.length && <ActivityIndicator />}

                </View>}
              </>
            )}
            <WhiteText>Tags </WhiteText>
            <View>
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
              />
            </View>
            <Button color={'#2e862e'} disabled={isSubmitting} title="Submit" onPress={handleSubmit} />
          </View>
          <View style={{ margin: 5, }}>
            {(isSubmitting) ? <ActivityIndicator /> :
              <Link href="../" asChild><Button color={'#86382e960'} title='Cancel'></Button></Link>
            }

          </View>
        </View>
      </View>
      <Status />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  TextF: {
    borderColor: 'white',
    color: 'white',
    textAlign: 'center',
    borderWidth: 2
  },
  iconStyle: {
    height: 10,
    width: 10,
  },
  // media item
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
  }
})
export default Modal