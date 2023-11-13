import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import { UserInterface } from "./interfaces";

export const userAtom = atomWithReset<UserInterface>({
    email: '',
    name: '',
    photo: '',
});
export const statusAtom = atom({
    status: '',
});

export const tagsAtom = atom([] as string[]);
  
