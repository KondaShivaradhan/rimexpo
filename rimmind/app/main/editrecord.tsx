import { Button, Image, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, router, useGlobalSearchParams, useLocalSearchParams, useRouter } from 'expo-router';
import WhiteText from '../../misc/Components/WhiteText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { FormValues, UserRecord, UserRecord2 } from '../../misc/interfaces';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { urls } from '../../misc/Constant';
import { useAtom } from 'jotai';
import { statusAtom, tagsAtom, userAtom } from '../../misc/atoms';
import Status from '../../misc/Components/Status';
export default function EditRecord() {
  const item = useLocalSearchParams();
  var temp: UserRecord = {
    description: '',
    id: 0,
    media: [],
    tags: [],
    title: "",
    user_email_id: 1,

  }
  if (isUserRecord(item)) {
    temp = {
      id: item.id !== undefined ? item.id : 0,
      user_email_id: item.user_email_id !== undefined ? item.user_email_id : 0,
      title: item.title ?? '',
      description: item.description ?? '',
      tags: item['tags'].split(','),
      media: item.media
      // Add other properties with the same pattern
    };

    console.log(temp);
  } else {
    console.error('Item is not of type UserRecord');
  }

  function isUserRecord(obj: any): obj is UserRecord2 {
    // Add your logic to check if the object has the properties expected in a UserRecord
    return typeof obj === 'object' && 'id' in obj && 'user_email_id' in obj && 'title' in obj && 'description' in obj;
  }
  const [ua, setua] = useAtom(userAtom)
  const [sa, setsa] = useAtom(statusAtom)
  const [tagsA, setsseta] = useAtom(tagsAtom)
  DropDownPicker.setTheme("DARK");
  DropDownPicker.setMode("BADGE");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(temp.tags);
  // const [items, setItems] = useState([
  //   { id: 1, title: 'Item 1', val: 'item-1',},
  //   { id: 2, title: 'Item 2', val: 'item-2' },
  // ]);

  const itemsy = tagsA.map((item, index) => ({
    label: item,
    value: item,
    id: index.toString(),

  }));
  const [items, setItems] = useState(itemsy);


  // icon: () => <Image source={{ uri: 'https://th.bing.com/th/id/OIP.PZzSjPirrDQZRj4xI2ILkAHaHa?pid=ImgDet&rs=1' }} style={styles.iconStyle} /> 
  // const [items, setItems] = useState(tagsA);

  // const { title, user, desp, TagArray } = req.body;
  const [formValues, setFormValues] = useState<FormValues>({
    user: ua.email,
    title: temp.title,
    desp: temp.description,
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
    const newArray: string[] = value.map((item: string) => item.toLowerCase());
    formValues.user = ua.email
    formValues.TagArray = newArray

    console.log('Form values submitted:', formValues);
    if (isFormValid(formValues)) {
      console.log("sending stuff to Database");
      try {


        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const response = await axios.put(`${urls.edit}?id=${temp.id}`, formValues, config);
        console.log(response.data);
        if (response.status == 200) {
          setsa({ status: response.data.message })
          router.replace('main/dashbord')
        }
        else {
          setsa({ status: response.data.message })

        }
      } catch (error) {
        console.log(`error sending data ${error}`);

      }

    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View>
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

          <WhiteText>Tags </WhiteText>
          <DropDownPicker
            open={open}
            multiple={true}
            min={1}
            value={value}
            items={items}
            // items={items.map((item, index) => ({ title: item, val: item, key: index.toString() }))}
            // items={items.map((item, index) => ({ label: item, value: item, id: index.toString() }))}
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
        <Link href="../" asChild><Button title='Cancel'></Button></Link>
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