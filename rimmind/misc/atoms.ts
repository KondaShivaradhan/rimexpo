import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { UserInterface, UserRecord } from "./interfaces";
import { GDrive } from "@robinbobin/react-native-google-drive-api-wrapper";

export const userAtom = atomWithReset<UserInterface>({
    email: '',
    name: '',
    photo: '',
});
export const statusAtom = atom({
    status: '',
});
export const recordsAtom = atom<UserRecord[]>([])
export const Appversion = atom("1.2.3");
export const tagsAtom = atom([] as string[]);
export const GdriveAtom = atom<GDrive | null>(null)

  
