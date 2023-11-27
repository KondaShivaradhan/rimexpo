export const urls = {
  devNode: "https://platypus-bold-sturgeon.ngrok-free.app",
  add: "https://platypus-bold-sturgeon.ngrok-free.app/rim/add",
  edit: "https://platypus-bold-sturgeon.ngrok-free.app/rim/",
  fetchRecords: "https://platypus-bold-sturgeon.ngrok-free.app/rim",
  delRecord: "https://platypus-bold-sturgeon.ngrok-free.app/rim"
}
// export const urls = {
//   devNode: "http://192.168.1.8:3003",
//   add: "http://192.168.1.8:3003/rim/add",
//   edit: "http://192.168.1.8:3003/rim/",
//   fetchRecords: "http://192.168.1.8:3003/rim",
//   delRecord: "http://192.168.1.8:3003/rim"
// }
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
    ver: '1.2.6',
    current:true,
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