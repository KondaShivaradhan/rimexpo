import { Button, FlatList, Image, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import WhiteText from '../../misc/Components/WhiteText';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { FormValues } from '../../misc/interfaces';
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
import ResumableUploader from '@robinbobin/react-native-google-drive-api-wrapper/api/aux/uploaders/ResumableUploader';
const Modal: React.FC<DrawerHeaderProps> = ({ navigation }) => {
  const [ua, setua] = useAtom(userAtom)
  const [sa, setsa] = useAtom(statusAtom)
  const [tagsA, setsseta] = useAtom(tagsAtom)
  DropDownPicker.setTheme("DARK");
  DropDownPicker.setMode("BADGE");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [gdrive, setGDrive] = useState<GDrive>()


  const [pickedDocuments, setPickedDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: '*/*', // Allow any type of file
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
    const newArray: string[] = value.map((item: string) => {
      return Encrypt(item.replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase(), ua.email);
    });
    formValues.user = ua.email
    formValues.TagArray = newArray
    formValues.title = Encrypt(formValues.title, ua.email)
    formValues.desp = Encrypt(formValues.desp, ua.email)
    console.log('Form values submitted:', formValues);
    if (isFormValid(formValues)) {
      console.log("sending stuff to Database");
      try {


        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const response = await axios.post(`${urls.add}`, formValues, config);
        console.log(response.data);
        if (response.status == 200) {
          setsa({ status: response.data.message })
          router.push('main/dashbord')
        }
        else {
          setsa({ status: response.data.message })

        }
      } catch (error) {
        console.log(`error sending data ${error}`);

      }

    }
    else {
      console.log("Invalid details")
    }
  }; const readFileAsBase64 = async (fileUri: string) => {
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
        var Fid:string = ""
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
        
                await gdrive.files
                  .newMultipartUploader()
                  .setData(base64Data, MimeTypes.BINARY)
                  .setIsBase64(true)
                  .setRequestBody({
                    name: pickedDocument.name,
                    parents:[data.result.id]
                  })
                  .execute();
                console.log(`File '${pickedDocument.name}' upload completed`);
                  
              
  
              //   const base64Data = await readFileAsBase64(pickedDocument.uri);
              //   const uploader = gdrive.files
              //   .newResumableUploader()
              //   .setData(base64Data, MimeTypes.BINARY)
              //   .setRequestBody({
              //     name: pickedDocument.name,
              //     // parents: ['13p9DHmWleA8nCDCOd15r-qt2wvc_bMZ8'],
              //     parents:[data.result.id]
              //   }) as ResumableUploader
    
              // console.log(await uploader.execute())
    
              // console.log('upload status', await uploader.requestUploadStatus())
              } catch (uploadError) {
                console.error(`Error uploading file '${pickedDocument.name}':`, uploadError);
                // Handle upload error as needed
              }
            }
    
          }
        )
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
      });
      setValue([])

    }, [navigation])
  );
  useEffect(() => {
    // GoogleSignin.configure({
    //     webClientId: '50096351635-0vu6ql2llffp5ldpl4fv82heoshmf6c1.apps.googleusercontent.com',
    //     offlineAccess: true,
    //     scopes: [
    //         'https://www.googleapis.com/auth/drive.appdata',
    //         'https://www.googleapis.com/auth/drive.file',
    //     ],
    // })

    const init = async () => {
      try {
        await GoogleSignin.signIn()

        const gdrv = new GDrive()

        gdrv.accessToken = (await GoogleSignin.getTokens()).accessToken

        gdrv.fetchCoercesTypes = true
        gdrv.fetchRejectsOnHttpErrors = true
        gdrv.fetchTimeout = 5000

        setGDrive(gdrv)
        console.log(gdrv);

      } catch (error) {
        console.log(error)
      }
    }

    init()
  }, [])

  // const init = async () => {
  //   try {

  //     const gdrv = new GDrive()

  //     gdrv.accessToken = (await GoogleSignin.getTokens()).accessToken

  //     gdrv.fetchCoercesTypes = true
  //     gdrv.fetchRejectsOnHttpErrors = true
  //     gdrv.fetchTimeout = 3000

  //     setGDrive(gdrv)
  //     console.log(gdrv);

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // init()
  const renderItem = ({ item }: { item: DocumentPicker.DocumentPickerAsset }) => (
    <View>
      <WhiteText>Document Name: {item.name}</WhiteText>
      <WhiteText>Document Size: {item.size} bytes</WhiteText>
      <WhiteText>Document URI: {item.uri}</WhiteText>
      <WhiteText>Document type: {item.mimeType}</WhiteText>
      {(item.mimeType?.includes("image")) &&
        <Image source={{ uri: item.uri }} height={150} width={150}></Image>
      }
      <WhiteText>-----------------------------</WhiteText>
    </View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
          <Button title='Media Pick' onPress={() => { pickDocument() }} />
          {pickedDocuments.length > 0 && (
            <FlatList
              data={pickedDocuments}
              renderItem={renderItem}
              keyExtractor={(item) => item.uri}
            />
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
          />
          {/* <Button color={'#2e862e'} title="Submit" onPress={handleSubmit} /> */}
          <Button color={'#2e862e'} title="Submit" onPress={handleFiles} />
        </View>
        <View style={{ margin: 5, }}>
          <Link href="../" asChild><Button color={'#86382e960'} title='Cancel'></Button></Link>

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
  }
})
export default Modal