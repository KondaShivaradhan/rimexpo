import { ActivityIndicator, Button, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, router, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import WhiteText from '../../misc/Components/WhiteText';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { FormValues, UserRecord, UserRecord2 } from '../../misc/interfaces';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { urls } from '../../misc/Constant';
import { useAtom } from 'jotai';
import { recordsAtom, statusAtom, tagsAtom, userAtom } from '../../misc/atoms';
import Status from '../../misc/Components/Status';
import { DrawerHeaderProps } from '@react-navigation/drawer'
interface tempProp{
  id?:string
}
const EditRecord: React.FC<DrawerHeaderProps> = ({ navigation }) => {
  console.log("$%#$%#$%#$%#$%#$%#$");
  console.log(useLocalSearchParams());
  const [Allrecords] = useAtom(recordsAtom)
  let param:tempProp = useLocalSearchParams()
  console.log(param.id);

  let numID: number | undefined;

  if (param.id !== undefined) {
    numID = parseInt(param.id, 10); // Use 10 as the radix for decimal representation
    console.log(numID);
  }
  
  
  let item:UserRecord | undefined = Allrecords.find(e => e.id == numID);
console.log(item)
  const [tagsA, setsseta] = useAtom(tagsAtom)
  function isUserRecord(obj: any): obj is UserRecord2 {

    return typeof obj === 'object' && 'id' in obj && 'user_email_id' in obj && 'title' in obj && 'description' in obj;
  }
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
  // console.log(`all tags in the account ${JSON.stringify(items)}`);


  const [formValues, setFormValues] = useState<FormValues>({
    user: ua.email,
    title: 'temp.title',
    desp: ' temp.description',
    TagArray: [],
  });
  const [value, setValue] = useState(formValues.TagArray);

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

        const response = await axios.put(`${urls.edit}?id=${item?.id}`, formValues, config);
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
  console.log(`got this form data at last is ${JSON.stringify(formValues)}`);

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
        });
        setValue(newArray)
      } else {
        console.error('Item is not of type UserRecord');
      }
    } catch (error) {
      console.error('Item is not of type UserRecord');
    }

  }, [item, ua.email]);
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
          <Text>{formValues.desp}</Text>
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