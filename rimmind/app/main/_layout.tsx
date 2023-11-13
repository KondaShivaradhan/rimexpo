import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Link, router } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useAtom } from 'jotai';
import React from 'react';
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
  const DContent = () => {
    return (

      <SafeAreaView style={styles.container}>
        <View style={styles.profile}>
          <Image source={{ uri: ua.photo }} style={styles.userImage} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{ua.name}</Text>
            <Text style={styles.userEmail}>{ua.email}</Text>
          </View>
        </View>
        <Pressable onPress={() => {
          router.push('main/dashbord')
        }}>
          <View style={styles.route}>
            <View style={styles.iconContainer}>
              <Entypo name="home" size={24} color="black" />
            </View>
            <View style={{ width: 'auto', }}>
              <Text>Dashboard</Text>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => {
          router.push('main/modal')
        }}>
          <View style={styles.route}>
            <View style={styles.iconContainer}>
              <Entypo name="new-message" size={24} color="black" />
            </View>
            <View style={{ width: 'auto', }}>
              <Text>New Record</Text>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => {
          router.push('main/profile')
        }}>
          <View style={styles.route}>
            <View style={styles.iconContainer}>
              <FontAwesome name="user" size={24} color="black" />
            </View>
            <View style={{  }}>
              <Text>Profile</Text>
            </View>
          </View>
        </Pressable>
        <Pressable onPress={() => {
          router.push('main/dashbord')
        }}>
          <View style={styles.route}>
            <View style={styles.iconContainer}>
              <Ionicons name="analytics" size={20} color="black" />
            </View>
            <View style={{ width: 'auto', }}>
              <Text>Analytics</Text>
            </View>
          </View>
        </Pressable>
        <Button title='Logout'onPress={signOut}></Button>
      </SafeAreaView>
    )
  }

  return (
    <Drawer
      drawerContent={DContent}
      screenOptions={{ swipeEdgeWidth: 0 }}>

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
    backgroundColor: '#ffffff',// Align children horizontally
    alignItems: 'center', // Align children vertically in the center
    padding: 10,
    gap:10,
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
