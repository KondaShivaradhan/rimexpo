export interface UserInterface {
  email: string;
  name: string;
  photo: string;
}
export interface FormValues {
  user:string
  title: string;
  desp: string;
  TagArray: string[];
}
export interface UserRecord {
  id: number;
  user_email_id: number;
  title: string;
  description: string;
  tags: string[];
  media: string[] | null;
}
export interface UserRecord2 {
  id: number;
  user_email_id: number;
  title: string;
  description: string;
  tags: string;
  media: string[] | null;
}
