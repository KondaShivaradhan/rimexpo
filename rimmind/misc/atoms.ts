import { atom } from "jotai";
import { UserInterface } from "./interfaces";

export const userAtom = atom<UserInterface>({
      email: '',
      name: '',
      photo: '',
  });