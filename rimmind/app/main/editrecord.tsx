import { ActivityIndicator, Button, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import WhiteText from '../../misc/Components/WhiteText';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { FormValues, UserRecord, UserRecord2 } from '../../misc/interfaces';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { Encrypt, urls } from '../../misc/Constant';
import { useAtom } from 'jotai';
import { recordsAtom, statusAtom, tagsAtom, userAtom } from '../../misc/atoms';
import Status from '../../misc/Components/Status';
import { DrawerHeaderProps } from '@react-navigation/drawer'
import FilesBox from '../../misc/Components/ShowFiles';
interface tempProp{
  ruid?:string
}
const EditRecord: React.FC<DrawerHeaderProps> = ({ navigation }) => {
  console.log("$%#$%#$%#$%#$%#$%#$");
  const [Allrecords] = useAtom(recordsAtom)
  let param:tempProp = useLocalSearchParams()
  console.log(param);
  
  let ruid = param.ruid;
  let item:UserRecord | undefined = Allrecords.find(e => e.ruid === ruid);
  const [tagsA, setsseta] = useAtom(tagsAtom)

  const [ua, setua] = useAtom(userAtom)
  const [sa, setsa] = useAtom(statusAtom)
  DropDownPicker.setTheme("DARK");
  DropDownPicker.setMode("BADGE");
  const [open, setOpen] = useState(false);


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
    media:[]
  });
  const [value, setValue] = useState(formValues.TagArray);

  const isFormValid = (formValues: FormValues): boolean => {
    if (!formValues.title  || formValues.TagArray.length === 0) {
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
    const newArray: string[] = value.map((item: string) => Encrypt(item.toLowerCase(),ua.email));
    var FinalVales: FormValues = {
      user: '',
      title: '',
      desp: '',
      TagArray: [],
      media: formValues.media
    }
    formValues.user = ua.email
    formValues.TagArray = newArray
    // formValues.user = ua.email
    FinalVales.user = ua.email
    // formValues.TagArray = newArray
    FinalVales.TagArray = newArray
    // formValues.title = Encrypt(formValues.title, ua.email)
    FinalVales.title = Encrypt(formValues.title, ua.email)
    // formValues.desp = Encrypt(formValues.desp, ua.email)
    FinalVales.desp = Encrypt(formValues.desp, ua.email)
    console.log('Form values Edited:', FinalVales);

    if (isFormValid(FinalVales)) {
      console.log("sending stuff to Database");
      try {


        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const response = await axios.put(`${urls.edit}?ruid=${item?.ruid}`, FinalVales, config);
        console.log("udpated responce - " + response.data);
        console.log("udpated responce status - " + response.status);
        if (response.status == 200) {
          console.log("Not same");
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
  };
  useEffect(() => {
    // Check if the item is a UserRecord
    try {
      if (item) {
        const newArray: string[] = item.tags.map((tag: string) => tag.toLowerCase());
        setFormValues({
          user: ua.email,
          title: item.title ?? '',
          desp: item.description ?? '',
          TagArray: newArray,
          media:item.media
        });
        setValue(newArray)
      } else {
      }
    } catch (error) {
    }

  }, [item]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'column', margin: 10, gap: 3, }}>
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
{(formValues.media != null)&&
          ( formValues.media.length > 0) && (
              <>
              <FilesBox edit={true} file={formValues.media}/>
              <Text style={{ fontSize: 9, color: 'white', textAlign: 'center' }}>File editing isnt supported</Text>
             
                <Text style={{ fontSize: 9, color: 'white', textAlign: 'center' }}>Selected Files {formValues.media.length}</Text>

                {/* <FlatList
                  style={{ backgroundColor: '#4c4c6678' }}
                  contentContainerStyle={{ justifyContent: 'center' }}
                  data={pickedDocuments}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.uri}
                  horizontal={true} // Set to true for a horizontal FlatList
                /> */}
                <Text style={{ fontSize: 9, color: 'white', textAlign: 'center' }}>* Click to deselect</Text>
{/* 
                {uploadP > 0 && <View>
                  <WhiteText>
                    Files being uploaded = {uploadP}/{pickedDocuments.length}

                  </WhiteText>
                  {uploadP != pickedDocuments.length && <ActivityIndicator />}

                </View>} */}
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
          />
          <Button title="Submit" onPress={handleSubmit} />
        </View>
        <View style={{ margin: 5, }}>
          <Link href="../" asChild><Button color={'#86382e960'} title='Cancel'></Button></Link>

        </View>
        <Text style={{ fontSize: 9, color: 'white', textAlign: 'center' }}>File editing isnt supported</Text>

      </View>
      <Status />
    </SafeAreaView>

  );
}
export default EditRecord
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