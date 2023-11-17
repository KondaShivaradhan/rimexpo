import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Link, router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useAtom } from 'jotai';
import React, { ReactNode } from 'react';
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { userAtom } from '../../misc/atoms';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
export default function Layout() {
  const [ua] = useAtom(userAtom)
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      router.replace('login')
    } catch (error) {
      console.error(error);
    }
  };


  interface NavigationButtonProps {
    onPress: () => void;
    icon: ReactNode;
    label: string;
  }
  
  const NavigationButton: React.FC<NavigationButtonProps> = ({ onPress, icon, label }) => {
    return (
      <Pressable onPress={onPress}>
        <View style={styles.route}>
          <View style={styles.iconContainer}>{icon}</View>
          <View style={{ width: 'auto' }}>
            <Text>{label}</Text>
          </View>
        </View>
      </Pressable>
    );
  };
  const DContent = () => {
    return (

      <SafeAreaView style={styles.container}>
        <View style={styles.profile}>
          <Image source={{ uri: ua.photo }} style={styles.userImage} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{ua.name}</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userEmail}>{ua.email}</Text>
          </View>
        </View>
        {/* dashboard */}

        <NavigationButton
        onPress={() => router.push('main/dashbord')}
        icon={   <Entypo name="home" size={24} color="black" />}
        label="Dashboard"
      />
        {/* add record */}
        <NavigationButton
        onPress={() => router.push('main/modal')}
        icon={  <Entypo name="new-message" size={24} color="black" />}
        label="New Record"
      />
          {/* profile */}
          <NavigationButton
        onPress={() => router.push('main/profile')}
        icon={ <FontAwesome name="user" size={24} color="black" />}
        label="Profile"
      />
          {/* analytics */}
          <NavigationButton
        onPress={() => router.push('main/dashbord')}
        icon={ <Ionicons name="analytics" size={20} color="black" />}
        label="Analytics"
      />
       
         {/* About */}
        <NavigationButton
        onPress={() => router.push('main/about')}
        icon={<AntDesign name="questioncircle" size={20} color="black" />}
        label="About"
      />
        <Button title='Logout'onPress={signOut}></Button>
      </SafeAreaView>
    )
  }

  return (
    <Drawer
      drawerContent={DContent}
      screenOptions={{ swipeEdgeWidth: 0,headerShown:true }}>

      <Drawer.Screen
        name="dashbord" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Home",
          title: "Home",
        }}
      />
      <Drawer.Screen
        name="modal"
        options={{
          drawerLabel: "New Record",
          title: "Add Record",
        }}
      />
      <Drawer.Screen
        name="editrecord"
        options={{
          drawerLabel: "Edit",
          title: "Edit",
          drawerItemStyle: { display: 'none' }
        }}
      />
 <Drawer.Screen
        name="about"
        options={{
          drawerLabel: "About",
          title: "About",
          drawerItemStyle: { display: 'none' }
        }}
      />
    </Drawer>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#272727',
    flex: 1,
    flexDirection: 'column',
  },
  route: {
    margin: 10,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    flexDirection: 'row',
    justifyContent:'flex-start',
    paddingVertical:10,
    paddingHorizontal:5,
    backgroundColor: '#ffffff',// Align children horizontally
    alignItems: 'center', // Align children vertically in the center
    gap:5,
  },
  userInfo: {
    // Add some margin between text and image
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Make it a circle
  },
  iconContainer: {
    width:30,
    flexDirection: 'column',
    alignItems: 'center',
  }
})
