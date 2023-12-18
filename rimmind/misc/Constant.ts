import CryptoJS from "react-native-crypto-js";
import { media } from "./interfaces";
import { GDrive, ListQueryBuilder, MimeTypes } from "@robinbobin/react-native-google-drive-api-wrapper";
import * as DocumentPicker from 'expo-document-picker';

import * as FileSystem from 'expo-file-system'
export const AppVersion: string = '1.3.2'
export const AppDetails: string[][] = [
  [
    'Editing record is now fully implemented',
    'Now record deletion will delete files in google drive, if any',
    'Can add new images, replacing the older images for a record',
    'Can remove images all together for a record'
  ],
  [
    'Files work is yet to be polished, error are proned',
    'Crashes are expected',
    'UI works are delayed'
  ]
];
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};
export const urls = {
  devNode: "https://platypus-bold-sturgeon.ngrok-free.app",
  add: "https://platypus-bold-sturgeon.ngrok-free.app/rim/add",
  edit: "https://platypus-bold-sturgeon.ngrok-free.app/rim/",
  fetchRecords: "https://platypus-bold-sturgeon.ngrok-free.app/rim",
  delRecord: "https://platypus-bold-sturgeon.ngrok-free.app/rim",
  getVersion: `https://platypus-bold-sturgeon.ngrok-free.app/rim/getver?ver=${AppVersion}`,
  getAPK: `https://platypus-bold-sturgeon.ngrok-free.app/rim/getapk`,
}

export const delRecord = (ruid: string): string => {
  return `${urls.delRecord}/?ruid=${ruid}`
}

export function extractDriveFileId(url: string): string | null {
  const regex = /(?:drive\.google\.com\/(?:.*?\/)?d\/|drive\.google\.com\/(?:.*?id=)?|drive\.google\.com\/open\?id=|drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
export const Encrypt = (text: string, email: string): string => {
  let ciphertext = CryptoJS.AES.encrypt(text, email).toString()
  return ciphertext
}
export function findNonSimilarElements(x: media[], y: media[]): media[] {
  var indexArray: number[] = []
  for (let index = 0; index < x.length; index++) {
    console.log(index);

  }
  return []
}

export const Decrypt = (ciphertext: string, email: string): string => {
  let bytes = CryptoJS.AES.decrypt(ciphertext, email);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText
}
const readFileAsBase64 = async (fileUri: string) => {
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
export const UploadNewMedia = async (gdrive: GDrive, pickedDocuments: DocumentPicker.DocumentPickerAsset[]): Promise<media[]> => {
  var UploadedFilesURLs: media[] = [];

  if (gdrive) {
    try {
      const data = await gdrive.files.createIfNotExists(
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
      );

      console.log(data);

      await Promise.all(
        pickedDocuments.map(async (pickedDocument) => {
          try {
            const base64Data = await readFileAsBase64(pickedDocument.uri);
            const result = await gdrive.files
              .newMultipartUploader()
              .setData(base64Data, MimeTypes.BINARY)
              .setIsBase64(true)
              .setRequestBody({
                name: pickedDocument.name,
                // @ts-ignore
                parents: [data.result.id],
              })
              .execute();

            console.log('Upload result:', result);
            const metadataResult = await gdrive.files.getMetadata(result.id, {
              fields: 'webViewLink',
            });

            console.log('Metadata result:', metadataResult.webViewLink);
            UploadedFilesURLs.push({ name: pickedDocument.name, url: metadataResult.webViewLink });
            console.log(`File '${pickedDocument.name}' upload completed`);
          } catch (uploadError) {
            console.error(`Error uploading file '${pickedDocument.name}':`, uploadError);
          }
        }),
      );

      console.log(`the final value is`);
      console.log(UploadedFilesURLs);

      return UploadedFilesURLs;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error; // or return Promise.reject(error);
    }
  } else {
    throw new Error('gdrive is falsy');
  }
};
export const DeleleFiles = async (gdrv: GDrive, toDel: media[]) => {
  try {

    const allURLs = toDel.map((x) => {
      console.log(x);
      //@ts-ignores
      return extractDriveFileId(x.url)
    })
    const deletePromises = allURLs.map(async (fileId) => {
      try {
        if (fileId) {
          if (gdrv) {
            try {
              await gdrv.files.delete(fileId);
              console.log(`File ${fileId} deleted successfully`);

              return true;

            } catch (error) {
console.log(error);
              return true;
            }

          }
          else {
            console.log(`No gdrive`);
          }
          return false
        }
        return false;
      } catch (error) {
        console.error(`Error deleting file ${fileId}:`, error);
      }
    });

    Promise.all(deletePromises).then(async (results) => {
      // Check if all deletions were successful
      const allDeleted = results.every(result => result);

      if (allDeleted) {
        return true
      }
      else {
        console.log('something wrong');
      }
    });







  } catch (error) {

    console.log(error)
  }
}
export const UploadNewMedia2 = async (gdrive: GDrive, pickedDocuments: DocumentPicker.DocumentPickerAsset[]) => {
  var UploadedFilesURLs: media[] = []

  if (gdrive) {
    try {
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

      createF().then(
        async (data) => {
          console.log(data);
          for (const pickedDocument of pickedDocuments) {
            try {
              const base64Data = await readFileAsBase64(pickedDocument.uri);
              const result = await gdrive.files
                .newMultipartUploader()
                .setData(base64Data, MimeTypes.BINARY)
                .setIsBase64(true)
                .setRequestBody({
                  name: pickedDocument.name,
                  // @ts-ignore
                  parents: [data.result.id],
                })
                .execute();

              const metadataResult = await gdrive.files.getMetadata(result.id, {
                fields: 'webViewLink',
              });
              UploadedFilesURLs.push({ name: pickedDocument.name, url: metadataResult.webViewLink })
            } catch (uploadError) {
              console.error(`Error uploading file '${pickedDocument.name}':`, uploadError);
            }
          }
          return UploadedFilesURLs
        }

      )

    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

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
