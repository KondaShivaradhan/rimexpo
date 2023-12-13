export interface UserInterface {
  email: string;
  name: string;
  photo: string;
  token:string
}
export interface FormValues {
  user:string
  title: string;
  desp: string;
  TagArray: string[];
}
export interface UserRecord {

  userid: number;
  title: string;
  description: string;
  tags: string[];
  media: string[] | null;
  ruid:string
}
export interface UserRecord2 {
  ruid:string
  userid: number;
  title: string;
  description: string;
  tags: string;
  media: string[] | null;
}
export interface Versions{
  ver:string,
  points:string[]
  current?:boolean
}
export interface PickedDocument {
  mimeType: string;
  name: string;
  size: number;
  uri: string;
}