import CryptoJS from "react-native-crypto-js";
export const urls = {
  devNode: "https://platypus-bold-sturgeon.ngrok-free.app",
  add: "https://platypus-bold-sturgeon.ngrok-free.app/rim/add",
  edit: "https://platypus-bold-sturgeon.ngrok-free.app/rim/",
  fetchRecords: "https://platypus-bold-sturgeon.ngrok-free.app/rim",
  delRecord: "https://platypus-bold-sturgeon.ngrok-free.app/rim"
}
export const delRecord = (ruid:string):string =>{
  return `${urls.delRecord}/?ruid=${ruid}`
}
export const Encrypt = (text:string,email:string):string=>{
  let ciphertext = CryptoJS.AES.encrypt(text, email).toString()
  console.log(ciphertext)
  return ciphertext
  
}

export const Decrypt = (ciphertext:string,email:string):string=>{
  let bytes  = CryptoJS.AES.decrypt(ciphertext, email);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText
}
export const classicDarkTheme = {
  background: "#1E1E1E",
  text: "#FFFFFF",
  accent: "#3498DB",
};
export const colortemp = [
  "#0D1B2A",
  "#1B263B",
  "#415A77",
  "#778DA9",
  "#E0E1DD"
]
import { Versions } from "./interfaces";

export const Allvers: Versions[] = [
  {
    ver: '1.2.8',
    current:true,
    points: [
      "Database changes are now reflected in the app",
      "Polished Edit screen with new independent fetching",
      "More optimized atoms"
    ]
  },
  {
    ver: '1.2.7',
    points: [
      "Major arch changes",
      "Backed issues fixed",
      "Editing record state issues fixed"
    ]
  },
  {
    ver: '1.2.6',
    points: [
      "Fixed Dev related Ui logging in production",
      "Created a local database for faster writes and reads",
      
    ]
  },
  {
    ver: '1.2.5',
    points: [
      "Added refresh control to the records list, just pull to refresh the list",
      "Local notification are working still no usecase",
      "Push Notifications have been installed with onesignal",
      "Logout funcnality has been added",
      "Changes to the UI"
    ]
  },
  {
    ver: '1.2.4',
    points: [
      "Added refresh control to the records list, just pull to refresh the list",
      "Local notification are working still no usecase",
      "Push Notifications have been installed with onesignal",
      "Logout funcnality has been added",
      "Changes to the UI"
    ]
  },
  {
    ver: '1.2.3',
    points: ["Added Link identification",
      "Fixed the Edit record UI and backed",
      "layout changed for the drawer navigation", "Added Aynsc storage for faster login", "Optimized code for web and mobile"]
  },
  {
    ver: 'Upcoming Features',
    points: [
      "A better Header",
      "Link seperation with relatable Icons"
    ],

  }
]