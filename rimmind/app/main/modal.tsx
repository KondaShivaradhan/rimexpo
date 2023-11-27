import { Button, Image, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import WhiteText from '../../misc/Components/WhiteText';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { FormValues } from '../../misc/interfaces';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { colortemp, urls } from '../../misc/Constant';
import { useAtom } from 'jotai';
import { statusAtom, tagsAtom, userAtom } from '../../misc/atoms';
import Status from '../../misc/Components/Status';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { useFocusEffect } from 'expo-router/src/useFocusEffect';
const Modal: React.FC<DrawerHeaderProps> =({navigation})=>{
  const [ua, setua] = useAtom(userAtom)
  const [sa, setsa] = useAtom(statusAtom)
  const [tagsA, setsseta] = useAtom(tagsAtom)
  DropDownPicker.setTheme("DARK");
  DropDownPicker.setMode("BADGE");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
 
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
      return item.replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    });
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

        const response = await axios.post(`${urls.add}`, formValues, config);
        console.log(response.data);
        if(response.status == 200){
          setsa({status:response.data.message})
          router.push('main/dashbord')
        }
        else{
          setsa({status:response.data.message})

        }
      } catch (error) {
        console.log(`error sending data ${error}`);

      }

    }
    else{
      console.log("Invalid details")
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setFormValues({
        user: '',
        title: '',
        desp: '',
        TagArray: [],
      });

    }, [navigation])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{flexDirection:'column',margin: 10,gap:10,}}>
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
          <Button color={'#2e862e'} title="Submit" onPress={handleSubmit} />
        </View>
        <View style={{margin:5,}}>
        <Link  href="../" asChild><Button color={'#86382e960'}title='Cancel'></Button></Link>

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