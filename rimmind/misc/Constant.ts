import CryptoJS from "react-native-crypto-js";
export const AppVersion:string = '1.3'

export const urls = {
  devNode: "https://platypus-bold-sturgeon.ngrok-free.app",
  add: "https://platypus-bold-sturgeon.ngrok-free.app/rim/add",
  edit: "https://platypus-bold-sturgeon.ngrok-free.app/rim/",
  fetchRecords: "https://platypus-bold-sturgeon.ngrok-free.app/rim",
  delRecord: "https://platypus-bold-sturgeon.ngrok-free.app/rim",
  getVersion: `https://platypus-bold-sturgeon.ngrok-free.app/rim/getver?ver=${AppVersion}`,
  getAPK: `https://platypus-bold-sturgeon.ngrok-free.app/rim/getapk`,
}
export const delRecord = (ruid:string):string =>{
  return `${urls.delRecord}/?ruid=${ruid}`
}
export const Encrypt = (text:string,email:string):string=>{
  let ciphertext = CryptoJS.AES.encrypt(text, email).toString()
  console.log(ciphertext)
  return ciphertext
  // return text
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
