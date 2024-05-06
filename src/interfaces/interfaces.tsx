type color =
  | "primary"
  | "error"
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | undefined;
export interface InputColorMessage {
  text: string;
  color: color;
}

export type fromRegisterContextType = {
  fromRegister: boolean;
  setFromRegister: (value: boolean) => void;
};

export type AvatarProperties = {
  gender: string;
  backgroundColor: string;
  mouthColor: string;
  eyeColor: string;
  eyelidsColor: string;
  hairColor: string;
  skinColor: string;
  noseColor: string;
  bowColor?: string;
  dimensions: string;
}

export type UserData = {
  id: string;
  avatarProps: AvatarProperties;
  username: string;
  description: string;
  exp: number;
  followers: string[];
  following: string[];
  posts: string[];
  favorites: string[];
  activity: { [key: string]: number[] };
  notifications: { [key: string]: string[] };
};


export type FlashcardSet = {
  creator: string;
  title: string;
  description: string;
  cover: string;
  category: string[];
  flashcards: { [key: string]: string };
  playCount: number;
};

export type ErrorMessasge = string | null;
